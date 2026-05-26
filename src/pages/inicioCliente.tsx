import { useNavigate } from 'react-router-dom';
import { useEstado } from '../hooks/estadocomedor';
import { useMesas } from '../hooks/mesas';

export function InicioCliente() {
    const navigate = useNavigate();
    const estadoComedor = useEstado();
    const { numeroMesa } = useMesas();

    // 1. PANTALLA: Restaurante Cerrado (Mantiene el estilo premium)
    if (estadoComedor.error != null || estadoComedor.estado?.status === false) {
        return (
            <div className="min-h-[100dvh] bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>
                
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-12 rounded-[2.5rem] shadow-2xl text-center w-full max-w-sm relative z-10">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                        <span className="text-5xl">🌙</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Cerrado</h1>
                    <p className="text-slate-300 font-medium text-lg leading-snug">
                        El comedor no está activo. <br/>Vuelve más tarde.
                    </p>
                </div>
            </div>
        );
    }

    // 2. PANTALLA: Selección de Mesa para el Cliente
    return (
        <div className="min-h-[100dvh] bg-slate-900 relative overflow-hidden font-sans">
            
            {/* Efectos de iluminación de fondo */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-10 -left-10 w-64 h-64 bg-orange-500 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-10 -right-10 w-64 h-64 bg-blue-500 rounded-full blur-[80px]"></div>
            </div>

            {/* Cabecera Premium */}
            <header className="relative z-10 pt-16 pb-10 px-6 text-center">
                <p className="text-orange-500 font-black tracking-[0.2em] text-xs uppercase mb-3">Bienvenidos a</p>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">La Buena Cuchara</h1>
                <p className="text-slate-400 font-medium text-lg">Selecciona tu mesa para ver el menú</p>
            </header>

            {/* Cuadrícula de Mesas */}
            <main className="relative z-10 px-6 pb-20 max-w-4xl mx-auto">
                {numeroMesa && numeroMesa.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                        {Array.from({ length: numeroMesa.length }).map((_, index) => {
                            const idMesa = index + 1;
                            return (
                                <button
                                    key={idMesa}
                                    onClick={() => navigate(`/cuenta/${idMesa}`)}
                                    className="group relative aspect-square w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg"
                                >
                                    
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <span className="text-slate-400 font-bold text-sm tracking-wider uppercase mb-1">Mesa</span>
                                    <span className="text-5xl font-black text-white">{idMesa}</span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 mt-4 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Comedor Vacío</h3>
                        <p className="text-slate-400">No hay mesas configuradas en el sistema en este momento.</p>
                    </div>
                )}
            </main>
        </div>
    );
}