import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// Interfaces
import type { Detalles, ComedorOrdenIN } from "../../interfaces/comedor";

// Hooks
import { useMenu } from "../../hooks/menu";
import { useEstado } from "../../hooks/estadocomedor";
import { useOrdenesMesa, useDetalleOrden, useCancelarOrden } from "../../hooks/ordenes";
import { useCrearOrden, useActualizarOrden, useMandarACaja } from "../../hooks/ordenes";

// Componentes
import { MenuDiaGrid } from "../../Componentes/menu/gridmenudia";
import { OrdenActivaTable } from "../../Componentes/ordenes/ordenActivaTable";
import { ModalPlatilloExtra } from "../../Componentes/ordenes/modalPlatilloExtra";
import { ModalDetalleOrden } from "../../Componentes/ordenes/ModalMostrarDetalles";
import { ModalDialogo } from "../../Componentes/ordenes/modalDialogo";

// Sockets
import { WebSocketComedor } from "../../config/socket";

// Notificaciones
import { triggerWaiterAlert } from "../../utils/Notificaciones";
export function MenuMesasMesero() {
    
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // 🆕 Importamos el refresh desde el hook corregido
    const { ordenActiva, historial, cargando, refresh: refreshOrden } = useOrdenesMesa(id);

    const estadoComedor = useEstado();
    const menu = useMenu();
    const { detallesOrden, cargandoDetalles, obtenerDetalle } = useDetalleOrden();

    // Hooks de Websocket
    const { crear, cargando: creando } = useCrearOrden();
    const { actualizar, cargando: actualizando } = useActualizarOrden();
    const { mandarACaja, cargando: enviandoCaja } = useMandarACaja(); // 🆕 Nuevo Hook
    const { cancelar, cargando: cancelando } = useCancelarOrden();
    
    const cargandoAccionWebsocket = creando || actualizando || enviandoCaja || cancelando;

    const [borrador, setBorrador] = useState<Detalles[]>([]);
    const [modalExtraAbierto, setModalExtraAbierto] = useState(false);
    const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
    //@ts-ignore
    const [idOrdenHistorial, setIdOrdenHistorial] = useState<number | null>(null); 

    const usuario = localStorage.getItem('user_info')
    //@ts-ignore
    const User = JSON.parse(usuario)['username']

    const [dialogo, setDialogo] = useState({
        abierto: false,
        tipo: 'info' as 'exito' | 'peligro' | 'info',
        titulo: '',
        mensaje: '',
        textoConfirmar: 'Aceptar',
        mostrarCancelar: false,
        accionConfirmar: () => navigate('/mesero')
    });

    const cerrarDialogo = () => setDialogo(prev => ({ ...prev, abierto: false }));

    const mostrarAlerta = (titulo: string, mensaje: string, tipo: 'exito' | 'peligro' | 'info' = 'exito', accionPostAlerta?: () => void) => {
        setDialogo({
            abierto: true, tipo, titulo, mensaje, textoConfirmar: 'Entendido',
            mostrarCancelar: false, 
            accionConfirmar: () => {
                cerrarDialogo();
                if (accionPostAlerta) accionPostAlerta();
            }
        });
    };

    const mostrarConfirmacion = (titulo: string, mensaje: string, accionConfirmar: () => void, tipo: 'peligro' | 'info' = 'peligro') => {
        setDialogo({
            abierto: true, tipo, titulo, mensaje, textoConfirmar: 'Sí, continuar',
            mostrarCancelar: true, 
            accionConfirmar: () => {
                cerrarDialogo();
                accionConfirmar();
            }
        });
    };

    // 🚀 LÓGICA DE ACTUALIZACIÓN ADMIN -> MESERO
    const ordenActivaRef = useRef(ordenActiva);
    useEffect(() => {
        ordenActivaRef.current = ordenActiva;
    }, [ordenActiva]);

    useEffect(() => {
        const handleOrdenActualizadaWebsocket = (data: { IdMesa: number, Mesero: string }) => {
            if (Number(data.IdMesa) === Number(id)) {
                // 1. Recargamos la información principal de la mesa (GET HTTP)
                if (refreshOrden) refreshOrden();
                 console.log(data)
                // 2. Extraemos el detalle nuevo
                const currentOrden = ordenActivaRef.current;
                if (currentOrden?.IdOrden && obtenerDetalle) {
                    obtenerDetalle(currentOrden.IdOrden);
                    if (data.Mesero === User){
                        triggerWaiterAlert(`Mesa ${data.IdMesa}`,'Orden Actualizada')
                        console.log('debio vibrar')
                    }
                }
            }
        };

        WebSocketComedor.on("orden_actualizada", handleOrdenActualizadaWebsocket);
        return () => {
            WebSocketComedor.off("orden_actualizada", handleOrdenActualizadaWebsocket);
        };
    }, [id, obtenerDetalle, refreshOrden]);

    useEffect(() => {
        if (ordenActiva?.IdOrden) {
            obtenerDetalle(ordenActiva.IdOrden);
        } else {
            setBorrador([]);
        }
    }, [ordenActiva?.IdOrden]);

    useEffect(() => {
        if (detallesOrden && ordenActiva) {
            setBorrador(detallesOrden.map(d => ({
                nombre_platillo: d.nombre_platillo,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario
            })));
        }
    }, [detallesOrden, ordenActiva?.IdOrden]);

    const agregarAlBorrador = (nombre: string, precio: number, cantidadAdd: number = 1) => {
        setBorrador(prev => {
            const existe = prev.find(p => p.nombre_platillo === nombre);
            if (existe) {
                return prev.map(p => 
                    p.nombre_platillo === nombre ? { ...p, cantidad: p.cantidad + cantidadAdd } : p
                );
            }
            return [...prev, { nombre_platillo: nombre, precio_unitario: precio, cantidad: cantidadAdd }];
        });
    };

    const modificarCantidadBorrador = (nombre: string, delta: number) => {
        setBorrador(prev => prev.map(item => {
            if (item.nombre_platillo === nombre) {
                return { ...item, cantidad: item.cantidad + delta };
            }
            return item;
        }).filter(item => item.cantidad > 0)); 
    };

    const generarPayload = (): ComedorOrdenIN => ({
        IdMesa: Number(id),
        Detalles: borrador,
        Mesero: User
    });

    const manejarCrearOActualizar = () => {
        if (borrador.length === 0) return;
        console.log(User)
        const payload = generarPayload();
        
        if (ordenActiva) {
            actualizar(payload, () => mostrarAlerta("¡Actualizado!", "Los platillos se mandaron a cocina correctamente.", "exito"));
        } else {
            crear(payload, () => mostrarAlerta("¡Orden Enviada!", "El ticket fue abierto exitosamente.", "exito", () => window.location.reload()));
        }
    };

    const manejarMandarACaja = () => {
        if (!ordenActiva) return;
        mostrarConfirmacion(
            "Enviar a Caja", 
            "¿Deseas enviar el ticket a la terminal del Cajero para su facturación y cobro? Esta mesa quedará libre inmediatamente.",
            () => {
                mandarACaja(generarPayload(), () => {
                    mostrarAlerta("Transferencia Exitosa", "La cuenta está ahora en Caja. Mesa liberada.", "exito", () => navigate('/mesero'));
                });
            },
            'info'
        );
    };

    const manejarCancelarOrden = () => {
        if (!ordenActiva) return;
        mostrarConfirmacion(
            "Anular Ticket", 
            "Estás a punto de cancelar por completo la orden a la cocina. ¿Estás seguro?",
            () => {
                cancelar(generarPayload(), () => {
                    mostrarAlerta("Anulada", "La orden ha sido cancelada y la mesa está libre.", "exito", () => navigate('/mesero'));
                });
            },
            'peligro'
        );
    };

    if (estadoComedor.error != null || estadoComedor.estado?.status === false || menu.error != null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <div className="bg-red-50 border border-red-200 p-8 rounded-3xl shadow-lg text-center max-w-sm">
                    <span className="text-5xl mb-4 block">😴</span>
                    <h1 className="text-2xl font-extrabold text-red-600 mb-2">Comedor Cerrado</h1>
                    <button onClick={() => navigate('/mesero')} className="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors w-full shadow-md">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium animate-pulse">Obteniendo mesa...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-slate-50 pb-32 animate-[fade-in_0.3s_ease-out]">

            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <button onClick={() => navigate('/mesero')} className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-100 transition-all">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 flex-1">Mesa <span className="text-blue-600">#{id}</span></h1>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Orden Activa</h2>
                </div>
                
                {cargandoDetalles ? (
                     <div className="bg-white rounded-3xl p-10 flex justify-center border border-slate-200 shadow-sm">
                         <span className="animate-pulse text-blue-500 font-semibold">Cargando ticket de la base de datos...</span>
                     </div>
                ) : (
                    <OrdenActivaTable 
                        detalles={borrador}
                        ordenActivaId={ordenActiva ? ordenActiva.IdOrden : null}
                        cargandoAccion={cargandoAccionWebsocket}
                        alModificarCantidad={modificarCantidadBorrador}
                        alCrearOActualizar={manejarCrearOActualizar}
                        alTerminarOrden={manejarMandarACaja}
                        alCancelarOrden={manejarCancelarOrden}
                    />
                )}
            </div>

            <div className="mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Menú del Día</h2>
                    </div>
                    
                    <button 
                        onClick={() => setModalExtraAbierto(true)}
                        className="bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Buscar Platillo Extra
                    </button>
                </div>

                <MenuDiaGrid 
                    cargando={menu.cargando} 
                    listaMenu={menu.menu || []} 
                    alAgregar={(nombre, precio) => agregarAlBorrador(nombre, precio, 1)}
                />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-slate-300 rounded-full"></div>
                    <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Historial de Turno</h2>
                </div>

                {historial && historial.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {historial.map((orden) => (
                            <div 
                                key={orden.IdOrden}
                                onClick={() => {
                                    setIdOrdenHistorial(orden.IdOrden);
                                    setModalHistorialAbierto(true);
                                    obtenerDetalle(orden.IdOrden);
                                }}
                                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-300 cursor-pointer group flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-extrabold text-lg text-slate-700 group-hover:text-blue-600 mb-1">Pedido #{orden.IdOrden}</h3>
                                    <p className="text-sm text-slate-500">Enviado a Caja</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-50">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-slate-400 font-medium">No hay registros de pedidos cerrados en este turno.</p>
                    </div>
                )}
            </div>
            
            {/* COMPONENTES DE DIÁLOGO EXTERNOS */}
            <ModalPlatilloExtra 
                abierto={modalExtraAbierto}
                alCerrar={() => setModalExtraAbierto(false)}
                alConfirmar={(nombre, precio, cant) => agregarAlBorrador(nombre, precio, cant)}
            />

            <ModalDetalleOrden
                abierto={modalHistorialAbierto}
                cargando={cargandoDetalles}
                detalles={detallesOrden || []}
                alCerrar={() => setModalHistorialAbierto(false)}
                esActiva={false} 
            />

            <ModalDialogo
                abierto={dialogo.abierto}
                tipo={dialogo.tipo}
                titulo={dialogo.titulo}
                mensaje={dialogo.mensaje}
                textoConfirmar={dialogo.textoConfirmar}
                mostrarCancelar={dialogo.mostrarCancelar}
                alConfirmar={dialogo.accionConfirmar}
                alCancelar={cerrarDialogo}
            />

        </div>
    );
}

export default MenuMesasMesero;