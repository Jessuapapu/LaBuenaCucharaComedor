import { useEstado } from '../hooks/estadocomedor';
import { useMesas } from '../hooks/mesas';

import { BotonMesa } from '../Componentes/mesa/mesaComponent';

export function IndexMesero() {
    const estadoComedor = useEstado();
    const { numeroMesa } = useMesas();

    
    // PANTALLA: Error o Comedor Cerrado (Adaptado a móvil)
    if (estadoComedor.error != null || estadoComedor.estado?.status === false) {
        return (
            // min-h-[100dvh] es vital en celulares para evitar recortes por la barra de direcciones
            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-100 p-4">
                <div className="bg-white border-t-4 border-t-red-500 px-6 py-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-center w-full max-w-sm">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-5xl">😴</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Cerrado</h1>
                    <p className="text-slate-500 font-medium text-lg leading-snug">
                        No hay turno activo. <br/>Espera a que abran el sistema.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-slate-50 animate-[fade-in_0.3s_ease-out]">
            
            {/* CABECERA APP-LIKE: Ultracompacta, pegajosa y con desenfoque */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                            Mesas
                        </h1>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Comedor
                        </span>
                    </div>
                    
                    {/* Indicador estilo "Píldora" nativa */}
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Activo
                    </div>
                </div>
            </header>

            {/* CONTENEDOR DE MESAS: Optimizado para pulgares */}
            <main className="px-4 pt-6 pb-28 md:px-8 max-w-7xl mx-auto">
                {numeroMesa && numeroMesa.length > 0 ? (
                    /* En móvil (por defecto): 2 columnas, gap-4 (aprox 16px). Perfecto para tocar sin mirar. */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
                        
                        {Array.from({ length: numeroMesa.length }).map((_, index) => (
                            <div 
                                key={index} 
                                className="w-full flex justify-center animate-[scale-in_0.3s_ease-out_both] active:scale-95 transition-transform" 
                                style={{ animationDelay: `${index * 20}ms` }}
                            >
                                <BotonMesa id={index + 1} />
                            </div>
                        ))}

                    </div>
                ) : (
                    /* ESTADO VACÍO */
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 mt-4 text-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">Sin mesas</h3>
                        <p className="text-slate-500 text-sm">No hay mesas configuradas.</p>
                    </div>
                )}
            </main>
            
        </div>
    );
}

export default IndexMesero;