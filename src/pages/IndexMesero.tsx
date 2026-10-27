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
            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#F6F0E2] p-4">
                <div className="bg-[#FFFDF7] border-t-4 border-t-[#B71F30] px-6 py-10 rounded-3xl shadow-[0_14px_42px_rgba(40,57,127,0.12)] text-center w-full max-w-sm">
                    <div className="w-24 h-24 bg-[#FEC345]/35 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-5xl">😴</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#28397F] mb-3 tracking-tight">Cerrado</h1>
                    <p className="text-[#14502E] font-medium text-lg leading-snug">
                        No hay turno activo. <br/>Espera a que abran el sistema.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-[#F6F0E2] animate-[fade-in_0.3s_ease-out]">
            
            {/* CABECERA APP-LIKE: Ultracompacta, pegajosa y con desenfoque */}
            <header className="sticky top-0 z-40 border-b border-[#9DA968]/35 bg-[#FFF8E7]/95 shadow-[0_4px_18px_rgba(40,57,127,0.06)] backdrop-blur-xl">
                <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-[#28397F] tracking-tight leading-none">
                            Mesas
                        </h1>
                        <span className="text-xs font-bold text-[#8D5A24] uppercase tracking-[0.2em] mt-1">
                            La Buena Cuchara
                        </span>
                    </div>
                    
                    {/* Indicador estilo "Píldora" nativa */}
                    <div className="flex items-center gap-2 rounded-full bg-[#14502E] px-4 py-2 text-xs font-bold tracking-wide text-[#FFF8E7] shadow-md shadow-[#14502E]/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEC345] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FEC345]"></span>
                        </span>
                        Activo
                    </div>
                </div>
            </header>

            {/* CONTENEDOR DE MESAS: Optimizado para pulgares */}
            <main className="mx-auto max-w-7xl px-4 pb-28 pt-7 md:px-8 md:pt-9">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-[#28397F]">Estado del comedor</h2>
                        <p className="mt-1 text-sm font-medium text-[#6E6658]">Selecciona una mesa para ver sus pedidos.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-[#9DA968]/30 bg-[#FFFDF7]/85 px-4 py-3 text-sm font-semibold text-[#28397F] shadow-sm" aria-label="Estado de las mesas">
                        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#14502E] shadow-sm shadow-[#14502E]/40" />Sin pendientes</span>
                        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#B71F30] shadow-sm shadow-[#B71F30]/40" />Con orden pendiente</span>
                    </div>
                </div>
                {numeroMesa && numeroMesa.length > 0 ? (
                    /* En móvil (por defecto): 2 columnas, gap-4 (aprox 16px). Perfecto para tocar sin mirar. */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
                        
                        {numeroMesa.map((mesa, index) => (
                            <div 
                                key={mesa.id_mesa ?? index} 
                                className="w-full flex justify-center animate-[scale-in_0.3s_ease-out_both] active:scale-95 transition-transform" 
                                style={{ animationDelay: `${index * 20}ms` }}
                            >
                                <BotonMesa id={mesa.id_mesa ?? index + 1} estado={mesa.Estado ? 'ocupada' : 'libre'} />
                            </div>
                        ))}

                    </div>
                ) : (
                    /* ESTADO VACÍO */
                    <div className="mt-4 rounded-3xl border-2 border-dashed border-[#9DA968]/50 bg-[#FFFDF7]/80 p-8 text-center shadow-sm">
                        <div className="w-16 h-16 bg-[#9DA968]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#14502E]/65" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-[#28397F] mb-1">Sin mesas</h3>
                        <p className="text-[#14502E] text-sm">No hay mesas configuradas.</p>
                    </div>
                )}
            </main>
            
        </div>
    );
}

export default IndexMesero;
