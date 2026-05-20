import type { ModalDetalleOrdenProps } from '../../../interfaces/comedor';



export function ModalDetalleOrden({ abierto, cargando, detalles, alCerrar }: ModalDetalleOrdenProps) {
    if (!abierto) return null;

    // El cálculo del total ahora vive aquí, ya que solo le importa al modal
    const granTotal = detalles.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);

    return (
        <div className="fixed inset-0 bg-slate-200/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all">
                
                {/* Cabecera */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-gray-800">Cuenta de Consumo</h3>
                    <button 
                        onClick={alCerrar}
                        className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {/* Cuerpo (Lista) */}
                <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
                    {cargando ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="text-blue-500 font-semibold animate-pulse">Obteniendo platillos...</span>
                        </div>
                    ) : detalles.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {detalles.map((item, index) => (
                                <div key={index} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800 text-lg">{item.nombre_platillo}</p>
                                        <p className="text-sm font-medium text-gray-500">
                                            {item.cantidad}x <span className="text-gray-400">@ C${item.precio_unitario}</span>
                                        </p>
                                    </div>
                                    <div className="font-bold text-gray-700 text-lg">
                                        C${(item.cantidad * item.precio_unitario).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">El pedido no tiene platillos registrados.</p>
                    )}
                </div>
                
                {/* Pie (Totales) */}
                <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                    {!cargando && detalles.length > 0 && (
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total</span>
                            <span className="font-black text-3xl text-blue-600">C${granTotal.toFixed(2)}</span>
                        </div>
                    )}
                    <button 
                        onClick={alCerrar}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}