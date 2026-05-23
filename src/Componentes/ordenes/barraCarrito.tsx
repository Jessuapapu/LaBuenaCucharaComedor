import { useState, useEffect } from "react";
import type { ItemCarrito } from "../../../interfaces/comedor"; 

interface BarraCarritoProps {
    carrito: ItemCarrito[];
    modificarCantidad: (idPlatillo: number, delta: number) => void;
    enviarPedido: () => void;
    enviandoOrden: boolean;
    totalCarrito: number;
    cantidadItems: number;
}

export function BarraCarrito({ 
    carrito, modificarCantidad, enviarPedido, enviandoOrden, totalCarrito, cantidadItems 
}: BarraCarritoProps) {
    
    const [expandido, setExpandido] = useState(false);

    // Si el carrito se vacía, lo cerramos automáticamente
    useEffect(() => {
        if (carrito.length === 0 && expandido) setExpandido(false);
    }, [carrito.length, expandido]);

    if (carrito.length === 0) return null;

    return (
        <>
            {/* FONDO OVERLAY (Solo se muestra cuando está expandido) */}
            {expandido && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setExpandido(false)}
                />
            )}

            {/* CONTENEDOR DEL CARRITO (Se eleva al 90% del height en móvil) */}
            <div className={`fixed bottom-0 left-0 w-full bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-50 transition-all duration-300 ease-out border-t border-slate-200 md:border-none md:rounded-t-none flex flex-col
                ${expandido ? 'h-[90dvh] rounded-t-[2.5rem]' : 'translate-y-0'}
            `}>
                
                {/* INDICADOR DE ARRASTRE (Grip Line) - Solo visible en móvil expandido */}
                {expandido && (
                    <div className="w-full flex justify-center pt-3 pb-1 md:hidden cursor-pointer" onClick={() => setExpandido(false)}>
                        <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>
                )}

                {/* BARRA RESUMEN (Clickable para abrir/cerrar) */}
                <div 
                    className="w-full px-5 py-4 md:px-8 md:py-6 flex items-center justify-between cursor-pointer md:cursor-default flex-shrink-0"
                    onClick={() => setExpandido(!expandido)}
                >
                    {/* VISTA MÓVIL */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                                {cantidadItems}
                            </div>
                            <span className="font-bold text-slate-700 text-lg">Tu Pedido</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-black text-2xl text-blue-600">C${totalCarrito.toFixed(2)}</span>
                            <div className={`p-1.5 rounded-full bg-slate-100 transition-transform ${expandido ? 'rotate-180 bg-slate-200' : ''}`}>
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* VISTA PC (Siempre visible) */}
                    <div className="hidden md:flex items-center justify-between w-full">
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total del Pedido</p>
                            <p className="text-3xl font-black text-blue-600 leading-none">C${totalCarrito.toFixed(2)}</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); enviarPedido(); }}
                            disabled={enviandoOrden}
                            className={`bg-slate-900 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-all flex items-center gap-3 ${enviandoOrden ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-1'}`}
                        >
                            {enviandoOrden ? 'Procesando...' : 'Confirmar Orden'}
                        </button>
                    </div>
                </div>

                {/* ZONA DE PLATILLOS (Toma el espacio restante con overflow) */}
                <div className={`flex-1 overflow-y-auto px-5 md:px-8 transition-opacity duration-300 ${expandido ? 'opacity-100' : 'opacity-0 hidden md:opacity-100 md:block'}`}>
                    
                    <h3 className="font-black text-slate-800 text-xl mb-4 md:hidden">Detalle</h3>
                    
                    <div className="flex flex-col gap-3 pb-6">
                        {carrito.map(item => (
                            <div key={item.id_platillo} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 gap-4">
                                
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-slate-800 text-lg leading-tight">
                                        {item.nombre_platillo}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500 mt-1">
                                        C${item.precio_unitario} c/u
                                    </span>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                    <span className="font-black text-slate-800 text-xl">
                                        C${(item.precio_unitario * item.cantidad).toFixed(2)}
                                    </span>
                                    
                                    {/* Selector de cantidad XL */}
                                    <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm h-12">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id_platillo, -1); }} 
                                            className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-red-500 active:bg-red-50 rounded-l-xl text-2xl transition-colors"
                                        >−</button>
                                        <span className="font-bold text-slate-800 w-10 text-center text-lg">{item.cantidad}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id_platillo, 1); }} 
                                            className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-blue-500 active:bg-blue-50 rounded-r-xl text-2xl transition-colors"
                                        >+</button>
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTÓN INFERIOR FIJO EN MÓVIL */}
                {expandido && (
                    <div className="p-5 border-t border-slate-100 bg-white md:hidden flex-shrink-0">
                        <button 
                            onClick={(e) => { e.stopPropagation(); enviarPedido(); }}
                            disabled={enviandoOrden}
                            className={`w-full bg-blue-600 text-white font-black text-lg py-4 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 ${enviandoOrden ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {enviandoOrden ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Enviando a Cocina...
                                </>
                            ) : 'Enviar a Cocina'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}