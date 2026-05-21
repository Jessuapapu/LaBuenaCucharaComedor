import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// Hooks
import { useMenu } from "../hooks/menu";
import { useEstado } from "../hooks/estadocomedor";
import { useOrdenesMesa, useDetalleOrden } from "../hooks/ordenes";
import { useCarrito } from "../hooks/carrito";

// Componentes Visuales
import { ImagenPlatilloWrapper } from "../Componentes/menu/ImagenPlatilloWrapper";
import { ModalDetalleOrden } from "../Componentes/ordenes/ModalMostrarDetalles"; 
import { BarraCarrito } from "../Componentes/ordenes/barraCarrito";


export function MenuMesas() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); 
    
    const estadoComedor = useEstado();
    const menu = useMenu(); 
    const { ordenActiva, historial, cargando } = useOrdenesMesa(id);
    const { detallesOrden, cargandoDetalles, obtenerDetalle, limpiarDetalles } = useDetalleOrden();
    const { carrito, agregarAlCarrito, modificarCantidad, totalCarrito, cantidadItems, enviarPedido, enviandoOrden } = useCarrito(id);

    // Estados para el Historial (Modal)
    const [modalAbierto, setModalAbierto] = useState<boolean>(false);
    
    // Estados para la Orden Activa (Acordeón Desplegable)
    const [activaDesplegada, setActivaDesplegada] = useState<boolean>(false);

    // --- MANEJADORES ---

    // Cuando se hace clic en la orden ACTIVA (Abre el acordeón)
    const manejarClicActiva = async (idOrden: number) => {
        if (activaDesplegada) {
            setActivaDesplegada(false);
            limpiarDetalles();
        } else {
            setActivaDesplegada(true);
            await obtenerDetalle(idOrden); 
        }
    };

    // Cuando se hace clic en una orden del HISTORIAL (Abre el Modal)
    const manejarClicHistorial = async (idOrden: number) => {
        setModalAbierto(true);
        await obtenerDetalle(idOrden); 
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        limpiarDetalles();
        // Si la orden activa estaba desplegada, la mantenemos abierta
        if(activaDesplegada && ordenActiva) {
            obtenerDetalle(ordenActiva.IdOrden);
        }
    };

    const alTerminarPedido = () => {
        alert("¡Orden enviada a cocina!");
        // Opcional: Recargar o refrescar estado
    };

    const formatearFecha = (fechaIso: string | null): string => {
        if (!fechaIso) return "N/A";
        return new Date(fechaIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // --- PROTECCIONES ---
    if (estadoComedor.error != null || estadoComedor.estado?.status === false || menu.error != null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <div className="bg-red-50 border border-red-200 p-8 rounded-3xl shadow-lg text-center max-w-sm">
                    <span className="text-5xl mb-4 block">😴</span>
                    <h1 className="text-2xl font-extrabold text-red-600 mb-2">Comedor Cerrado</h1>
                    <p className="text-red-400 font-medium mb-6">No se pueden tomar órdenes en este momento.</p>
                    <button onClick={() => navigate('/')} className="bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors w-full shadow-md">
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
                <div className="text-slate-500 font-medium animate-pulse">Obteniendo información...</div>
            </div>
        );
    }

    const listaMenu = menu.menu || [];
    const listaHistorial = historial || [];
    
    // Calculamos el total de la orden activa si está desplegada
    const totalOrdenActiva = detallesOrden.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-slate-50 pb-32 animate-[fade-in_0.3s_ease-out]">
            
            {/* CABECERA */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <button onClick={() => navigate('/')} className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-100 transition-all group">
                    <svg className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 flex-1">Mesa <span className="text-blue-600">#{id}</span></h1>
            </div>

            {/* SECCIÓN ORDEN ACTIVA */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Orden Activa</h2>
                </div>
                
                {ordenActiva ? (
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden transition-all">
                        {/* Cabecera Clickable (Abre/Cierra el acordeón) */}
                        <div 
                            onClick={() => manejarClicActiva(ordenActiva.IdOrden)}
                            className="bg-gradient-to-r from-slate-50 to-white p-6 cursor-pointer hover:bg-slate-50 flex justify-between items-center group"
                        >
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Ticket actual</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-2xl text-slate-800">#{ordenActiva.IdOrden}</span>
                                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> En Curso
                                    </span>
                                </div>
                                <span className="text-slate-500 text-sm font-medium mt-2 block">
                                    Entrada: {formatearFecha(ordenActiva.HoraEntrada)}
                                </span>
                            </div>
                            
                            {/* Icono de flecha (gira si está desplegado) */}
                            <div className={`p-2 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${activaDesplegada ? 'rotate-180 bg-blue-100 text-blue-600' : 'group-hover:bg-slate-200'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        {/* Contenido Desplegable (La Tablita) */}
                        {activaDesplegada && (
                            <div className="border-t border-slate-100 bg-white p-6 animate-[slide-down_0.2s_ease-out]">
                                {cargandoDetalles ? (
                                    <div className="flex justify-center py-6">
                                        <span className="animate-pulse text-blue-500 font-semibold">Cargando platillos...</span>
                                    </div>
                                ) : detallesOrden.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                                                    <th className="pb-3 font-semibold">Platillo</th>
                                                    <th className="pb-3 font-semibold text-center">Cant.</th>
                                                    <th className="pb-3 font-semibold text-right">Precio</th>
                                                    <th className="pb-3 font-semibold text-right">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {detallesOrden.map((item, idx) => (
                                                    <tr key={idx} className="text-sm">
                                                        <td className="py-3 font-bold text-slate-700">{item.nombre_platillo}</td>
                                                        <td className="py-3 text-center text-slate-500 font-medium">x{item.cantidad}</td>
                                                        <td className="py-3 text-right text-slate-500">C${item.precio_unitario}</td>
                                                        <td className="py-3 text-right font-bold text-slate-800">C${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={3} className="pt-4 text-right font-bold text-slate-400 uppercase text-xs">Total Parcial:</td>
                                                    <td className="pt-4 text-right font-black text-blue-600 text-lg">C${totalOrdenActiva.toFixed(2)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-400 italic py-4">No hay platillos registrados aún.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                        <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        <p className="text-slate-500 font-semibold text-lg">La mesa está libre</p>
                        <p className="text-slate-400 text-sm mt-1">Selecciona platillos del menú para abrir una orden.</p>
                    </div>
                )}
            </div>

            {/* SECCIÓN MENÚ DEL DÍA */}
            <div id="seccion-menu" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Menú del Día</h2>
                </div>

                {menu.cargando ? (
                    <div className="flex justify-center py-10"><span className="animate-pulse text-slate-500 font-bold">Cargando menú...</span></div>
                ) : listaMenu.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {listaMenu.map((platillo) => (
                            <div key={platillo.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                
                                {/* AQUÍ APLICAMOS TU COMPONENTE ENVOLTORIO */}
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                    <ImagenPlatilloWrapper 
                                        idPlatillo={platillo.id} 
                                        nombrePlatillo={platillo.NombrePlatillo} 
                                    />
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{platillo.NombrePlatillo}</h3>
                                        <p className="text-emerald-600 font-black mt-1">C${platillo.PrecioUnico}</p>
                                    </div>
                                    <button 
                                        onClick={() => agregarAlCarrito(platillo)}
                                        className="mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-1.5 px-3 rounded-lg text-sm transition-colors w-max self-end"
                                    >
                                        + Añadir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center"><p className="text-slate-400 font-medium">No hay platillos disponibles hoy.</p></div>
                )}
            </div>

            {/* SECCIÓN HISTORIAL */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-slate-300 rounded-full"></div>
                    <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Historial</h2>
                </div>

                {listaHistorial.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listaHistorial.map((orden) => (
                            <div 
                                key={orden.IdOrden} 
                                // El Historial SÍ abre el Modal
                                onClick={() => manejarClicHistorial(orden.IdOrden)}
                                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-extrabold text-lg text-slate-700 group-hover:text-blue-600 transition-colors mb-2">
                                        Pedido #{orden.IdOrden}
                                    </h3>
                                    <div className="space-y-1 text-sm text-slate-500">
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> 
                                            Entrada: <span className="font-medium text-slate-700">{formatearFecha(orden.HoraEntrada)}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> 
                                            Salida: <span className="font-medium text-slate-700">{formatearFecha(orden.HoraSalida)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-50 transition-colors">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-slate-400 font-medium">No hay registros de pedidos anteriores en este turno.</p>
                    </div>
                )}
            </div>

            {/* MODAL (Solo se usa para el historial ahora) */}
            <ModalDetalleOrden 
                abierto={modalAbierto} 
                cargando={cargandoDetalles} 
                detalles={detallesOrden || []} 
                alCerrar={cerrarModal} 
                esActiva={false} // Siempre será falso porque la activa usa la tabla
            />

            <BarraCarrito 
                carrito={carrito || []}
                modificarCantidad={modificarCantidad}
                enviarPedido={() => enviarPedido(alTerminarPedido)}
                enviandoOrden={enviandoOrden}
                totalCarrito={totalCarrito || 0}
                cantidadItems={cantidadItems || 0}
            />

        </div>
    );
}

export default MenuMesas;