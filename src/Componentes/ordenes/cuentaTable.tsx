import type { CuentaClienteProps } from "../../interfaces/comedor";

import { ImagenPlatilloWrapper } from "../menu/ImagenPlatilloWrapper";


export function CuentaClienteTable({ detalles = [], ordenActivaId }: CuentaClienteProps) {
    const listaSegura = Array.isArray(detalles) ? detalles : [];
    
    const subtotal = listaSegura.reduce((acc, item) => acc + ((item?.cantidad || 0) * (item?.precio_unitario || 0)), 0);
    const total = subtotal

    
    if (listaSegura.length === 0 && !ordenActivaId) {
        return (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-4xl mb-3 block">🍽️</span>
                <p className="text-slate-800 font-bold text-xl">Tu mesa está libre</p>
                <p className="text-slate-500 text-sm mt-1">Revisa el menú del día abajo y llama al mesero para ordenar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative">
            <div className="h-3 w-full bg-blue-600"></div>

            <div className="p-5 md:p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Tu Orden</span>
                        <span className="font-black text-2xl text-slate-800">Ticket #{ordenActivaId}</span>
                    </div>
                    <div className="bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm border border-emerald-200">
                        En Curso
                    </div>
                </div>

                <div className="space-y-4">
                    {listaSegura.map((item) => (
                        <div key={item.nombre_platillo || Math.random()} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">

                                        <ImagenPlatilloWrapper 
                                            idPlatillo={0} 
                                            nombrePlatillo={item?.nombre_platillo} 
                                        />
                                        
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                                        x{item?.cantidad || 0}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-800 text-base leading-tight mb-1">
                                        {item?.nombre_platillo || "Platillo"}
                                    </h4>
                                    <span className="text-slate-500 font-medium text-sm">
                                        C${item?.precio_unitario?.toFixed(2) || "0.00"} c/u
                                    </span>
                                </div>
                            </div>

                            <div className="text-right pl-4">
                                <span className="font-black text-slate-800 text-lg md:text-xl">
                                    C${((item?.cantidad || 0) * (item?.precio_unitario || 0)).toFixed(2)}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-500 font-medium text-sm">
                        <span>Subtotal consumido</span>
                        <span>C${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">Total a Pagar</span>
                        <span className="font-black text-3xl md:text-4xl text-blue-600">C${total.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}