import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// Interfaces
import type { Detalles, ComedorOrdenIN } from "../../interfaces/comedor";

// Hooks
import { useMenu } from "../hooks/menu";
import { useEstado } from "../hooks/estadocomedor";
import { useOrdenesMesa, useDetalleOrden, useCancelarOrden } from "../hooks/ordenes";
import { useCrearOrden, useActualizarOrden, useGuardarOrden } from "../hooks/ordenes"

// Componentes
import { MenuDiaGrid } from "../Componentes/menu/gridmenudia";
import { OrdenActivaTable } from "../Componentes/ordenes/ordenActiva"
import { ModalPlatilloExtra } from "../Componentes/ordenes/modalPlatilloExtra";
import { ModalDetalleOrden } from "../Componentes/ordenes/ModalMostrarDetalles";

import { ModalDialogo } from "../Componentes/ordenes/modalDialogo";


export function MenuMesas() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const estadoComedor = useEstado();
    const menu = useMenu();
    
    const { ordenActiva, historial, cargando } = useOrdenesMesa(id);
    const { detallesOrden, cargandoDetalles, obtenerDetalle } = useDetalleOrden();

    // Hooks de Websocket
    const { crear, cargando: creando } = useCrearOrden();
    const { actualizar, cargando: actualizando } = useActualizarOrden();
    const { guardar, cargando: cerrando } = useGuardarOrden();
    const { cancelar, cargando: cancelando } = useCancelarOrden();
    
    const cargandoAccionWebsocket = creando || actualizando || cerrando || cancelando;

    const [borrador, setBorrador] = useState<Detalles[]>([]);

    const [modalExtraAbierto, setModalExtraAbierto] = useState(false);
    const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);

    // eslint-disable-next-line @typescript-eslint  
    const [idOrdenHistorial, setIdOrdenHistorial] = useState<number | null>(null); 

    // ESTADO PARA EL MODAL DE DIÁLOGO
    const [dialogo, setDialogo] = useState({
        abierto: false,
        tipo: 'info' as 'exito' | 'peligro' | 'info',
        titulo: '',
        mensaje: '',
        textoConfirmar: 'Aceptar',
        mostrarCancelar: false,
        accionConfirmar: () => {}
    });

    const cerrarDialogo = () => setDialogo(prev => ({ ...prev, abierto: false }));

    // MODIFICADO: Ahora acepta una acción extra que se ejecuta DESPUÉS de darle a "Entendido"
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

    useEffect(() => {
        if (ordenActiva?.IdOrden) {
            obtenerDetalle(ordenActiva.IdOrden);
        } else {
            setBorrador([]);
        }
    }, [ordenActiva]);

    useEffect(() => {
        if (detallesOrden && ordenActiva) {
            setBorrador(detallesOrden.map(d => ({
                nombre_platillo: d.nombre_platillo,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario
            })));
        }
    }, [detallesOrden, ordenActiva]);

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
        Detalles: borrador
    });

    const manejarCrearOActualizar = () => {
        if (borrador.length === 0) return;
        const payload = generarPayload();
        
        if (ordenActiva) {
            // Actualizar: solo mostramos éxito
            actualizar(payload, () => mostrarAlerta("¡Actualizado!", "Los platillos se mandaron a cocina correctamente.", "exito"));
        } else {
            // Crear: mostramos éxito y recargamos para que detecte la nueva orden activa
            crear(payload, () => mostrarAlerta("¡Orden Enviada!", "El ticket fue abierto exitosamente.", "exito", () => window.location.reload()));
        }
    };

    const manejarTerminarOrden = () => {
        if (!ordenActiva) return;
        mostrarConfirmacion(
            "Cobrar Orden", 
            "¿La mesa ya ha cancelado la cuenta? Esta acción cerrará el ticket actual.",
            () => {
                guardar(generarPayload(), () => {
                    // Cierra, vacía y te regresa al mapa
                    mostrarAlerta("Orden Cerrada", "La mesa ahora está libre.", "exito", () => navigate('/'));
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
                    // Cancela, vacía y te regresa al mapa
                    mostrarAlerta("Anulada", "La orden ha sido cancelada y la mesa está libre.", "exito", () => navigate('/'));
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
                    <button onClick={() => navigate('/')} className="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors w-full shadow-md">
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
                <button onClick={() => navigate('/')} className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-100 transition-all">
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
                     <div className="bg-white rounded-3xl p-10 flex justify-center border border-slate-200 shadow-sm"><span className="animate-pulse text-blue-500 font-semibold">Cargando ticket de la base de datos...</span></div>
                ) : (
                    <OrdenActivaTable 
                        detalles={borrador}
                        ordenActivaId={ordenActiva ? ordenActiva.IdOrden : null}
                        cargandoAccion={cargandoAccionWebsocket}
                        alModificarCantidad={modificarCantidadBorrador}
                        alCrearOActualizar={manejarCrearOActualizar}
                        alTerminarOrden={manejarTerminarOrden}
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
                                    <p className="text-sm text-slate-500">Cobrado/Cerrado</p>
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

            {/* NUESTRO NUEVO MODAL DE ALERTAS/CONFIRMACIONES */}
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

export default MenuMesas;