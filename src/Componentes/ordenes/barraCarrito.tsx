
import type { BarraCarritoProps } from "../../../interfaces/comedor";

export function BarraCarrito({ 
    carrito, 
    modificarCantidad, 
    enviarPedido, 
    enviandoOrden, 
    totalCarrito, 
    cantidadItems 
}: BarraCarritoProps) {
    
    // Si el carrito está vacío, no renderizamos nada
    if (carrito.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4 md:p-6 z-40 animate-[slide-up_0.3s_ease-out]">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Resumen de items (Scrolleable horizontal en móvil) */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-1/2 pb-2 md:pb-0 hide-scrollbar">
                    {carrito.map(item => (
                        <div key={item.id_platillo} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 flex-shrink-0">
                            <div className="flex flex-col items-center justify-center w-8">
                                <button onClick={() => modificarCantidad(item.id_platillo, 1)} className="text-slate-400 hover:text-blue-500 p-1 font-bold">+</button>
                                <span className="font-bold text-slate-800 text-sm leading-none">{item.cantidad}</span>
                                <button onClick={() => modificarCantidad(item.id_platillo, -1)} className="text-slate-400 hover:text-red-500 p-1 font-bold">-</button>
                            </div>
                            <div className="flex flex-col pr-2 w-24">
                                <span className="text-xs font-bold text-slate-700 truncate" title={item.nombre_platillo}>
                                    {item.nombre_platillo}
                                </span>
                                <span className="text-xs text-slate-500">C${item.precio_unitario * item.cantidad}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totales y Botón Enviar */}
                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Total ({cantidadItems} items)</p>
                        <p className="text-2xl font-black text-blue-600 leading-none">C${totalCarrito.toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={enviarPedido}
                        disabled={enviandoOrden}
                        className={`bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 ${enviandoOrden ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-1'}`}
                    >
                        {enviandoOrden ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Enviando...
                            </>
                        ) : 'Confirmar Orden'}
                    </button>
                </div>
            </div>
        </div>
    );
}