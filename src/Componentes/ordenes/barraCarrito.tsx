import { useState } from "react";
import type { BarraCarritoProps } from "../../../interfaces/comedor";

export function BarraCarrito({ 
    carrito, 
    modificarCantidad, 
    enviarPedido, 
    enviandoOrden, 
    totalCarrito, 
    cantidadItems 
}: BarraCarritoProps) {
    
    // Estado local para abrir/cerrar los detalles del carrito en móvil
    const [expandido, setExpandido] = useState(false);

    if (carrito.length === 0) {
        // Si el carrito se vacía y estaba abierto, lo cerramos
        if (expandido) setExpandido(false);
        return null;
    }

    return (
        <>
            {/* Fondo oscuro cuando el carrito está expandido en móvil */}
            {expandido && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity md:hidden"
                    onClick={() => setExpandido(false)}
                />
            )}

            {/* Contenedor Principal del Carrito */}
            <div className={`fixed bottom-0 left-0 w-full bg-white z-50 transition-transform duration-300 ease-in-out md:border-t md:border-slate-200 md:shadow-[0_-10px_30px_rgba(0,0,0,0.1)] rounded-t-3xl md:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.15)] ${expandido ? 'translate-y-0' : 'translate-y-[calc(100%-80px)] md:translate-y-0'}`}>
                
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center">
                    
                    {/* CABECERA (Visible siempre en móvil, oculta en desktop) */}
                    <div 
                        className="h-20 px-6 flex items-center justify-between cursor-pointer md:hidden active:bg-slate-50 rounded-t-3xl"
                        onClick={() => setExpandido(!expandido)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cantidadItems}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Parcial</p>
                                <p className="font-black text-xl text-slate-800 leading-none">C${totalCarrito.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className={`p-2 bg-slate-100 rounded-full text-slate-500 transition-transform duration-300 ${expandido ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                        </div>
                    </div>

                    {/* CUERPO EXPANDIBLE (Lista de items y botón enviar) */}
                    <div className="px-6 pb-8 md:p-6 w-full flex flex-col md:flex-row gap-6 md:justify-between border-t border-slate-100 md:border-none">
                        
                        {/* Lista de Items */}
                        <div className="flex flex-col md:flex-row gap-3 overflow-y-auto max-h-[40vh] md:max-h-none md:overflow-x-auto hide-scrollbar w-full pt-4 md:pt-0">
                            {carrito.map(item => (
                                <div key={item.id_platillo} className="flex items-center justify-between md:justify-start gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 md:flex-shrink-0">
                                    
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">{item.nombre_platillo}</span>
                                        <span className="text-sm text-slate-500">C${item.precio_unitario * item.cantidad}</span>
                                    </div>

                                    {/* Botones + / - estilo píldora para móvil */}
                                    <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm">
                                        <button 
                                            onClick={() => modificarCantidad(item.id_platillo, -1)} 
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-l-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                                        </button>
                                        <span className="font-black text-slate-800 w-6 text-center select-none">{item.cantidad}</span>
                                        <button 
                                            onClick={() => modificarCantidad(item.id_platillo, 1)} 
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-r-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botón de Confirmar y Total Desktop */}
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0 pt-2 border-t border-slate-100 md:border-none">
                            <div className="hidden md:block text-right pr-4 border-r border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total ({cantidadItems} items)</p>
                                <p className="text-3xl font-black text-blue-600 leading-none">C${totalCarrito.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={enviarPedido}
                                disabled={enviandoOrden}
                                className={`w-full md:w-auto bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${enviandoOrden ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-1'}`}
                            >
                                {enviandoOrden ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Enviando orden...
                                    </>
                                ) : (
                                    <>
                                        <span className="md:hidden bg-white/20 px-3 py-1 rounded-full text-sm">C${totalCarrito.toFixed(2)}</span>
                                        Enviar a Cocina
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}