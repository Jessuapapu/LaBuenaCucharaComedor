import { useNavigate } from 'react-router-dom';
import { useEstado } from '../hooks/estadocomedor';
import { useMesas } from '../hooks/mesas';
import { Link } from 'react-router-dom';

export function InicioCliente() {
    const navigate = useNavigate();
    const estadoComedor = useEstado();
    const { numeroMesa } = useMesas();

    // 1. PANTALLA: Restaurante Cerrado (Mantiene el estilo premium)
    if (estadoComedor.error != null || estadoComedor.estado?.status === false) {
        return (
            <div className="min-h-[100dvh] bg-[#FFF8E7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#DE652E] rounded-full blur-[100px] opacity-15"></div>

                <div className="bg-white/85 backdrop-blur-xl border border-[#FEC345]/60 px-8 py-12 rounded-[2.5rem] shadow-xl shadow-[#28397F]/10 text-center w-full max-w-sm relative z-10">
                    <div className="w-24 h-24 bg-[#FEC345]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#FEC345]/60">
                        <span className="text-5xl">🌙</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#28397F] mb-3 tracking-tight">Cerrado</h1>
                    <p className="text-[#14502E] font-medium text-lg leading-snug">
                        El comedor no está activo. <br />Vuelve más tarde.
                    </p>
                </div>
            </div>
        );
    }

    // 2. PANTALLA: Selección de Mesa para el Cliente
    return (
        <div className="min-h-[100dvh] bg-[#FFF8E7] relative overflow-hidden font-sans">

            {/* Fondo de tomates con una capa clara para mantener el contraste */}
            <div className="absolute inset-0 bg-[url('/fondo-tomates.png')] bg-cover bg-center bg-no-repeat opacity-80" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8E7]/15 via-[#FFF8E7]/25 to-[#FFF8E7]/35 pointer-events-none" aria-hidden="true"></div>

            {/* Cabecera Premium */}
            <header className="relative z-10 pt-16 pb-10 px-6 text-center">
                <p className="text-[#B71F30] font-black tracking-[0.2em] text-sm md:text-base uppercase mb-3">Bienvenidos a</p>
                <h1 className="text-5xl md:text-6xl font-black text-[#28397F] mb-4 tracking-tight">La Buena Cuchara</h1>
                <p className="text-[#14502E] font-medium text-lg">Selecciona tu mesa para ver el menú</p>
            </header>

            {/* Cuadrícula de Mesas */}
            <main className="relative z-10 px-6 pb-12 max-w-4xl mx-auto">
                {numeroMesa && numeroMesa.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                        {numeroMesa.map((mesa, index) => {
                            const idMesa = mesa.id_mesa ?? index + 1;
                            const tienePendientes = Boolean(mesa.Estado);
                            return (
                                <button
                                    key={idMesa}
                                    onClick={() => navigate(`/cuenta/${idMesa}`)}
                                    className={`group relative aspect-square w-full border border-white/35 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center overflow-hidden hover:-translate-y-1 hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg ${tienePendientes ? 'bg-[#B71F30]/85 shadow-[#B71F30]/25' : 'bg-[#14502E]/85 shadow-[#14502E]/25'}`}
                                >

                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <span className="text-[#FFF8E7]/80 font-bold text-sm tracking-wider uppercase mb-1">Mesa</span>
                                    <span className="text-5xl font-black text-white">{idMesa}</span>
                                    <span className={`mt-2 text-xs font-bold ${tienePendientes ? 'text-[#FEC345]' : 'text-[#FFF8E7]'}`}>{tienePendientes ? 'Orden pendiente' : 'Sin pendientes'}</span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-md border border-[#FEC345]/60 rounded-[2rem] p-10 mt-4 text-center shadow-lg shadow-[#28397F]/10">
                        <div className="w-16 h-16 bg-[#FEC345]/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FEC345]/60">
                            <svg className="w-8 h-8 text-[#DE652E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-[#28397F] mb-2">Comedor Vacío</h3>
                        <p className="text-[#14502E]">No hay mesas configuradas en el sistema en este momento.</p>
                    </div>
                )}


            </main>
            <div className="relative z-10 w-full px-6 pb-8 flex justify-start">
                <Link
                    to="/mesero"
                    className="group flex items-center gap-3 rounded-2xl border border-[#FEC345] bg-white/85 px-5 py-4 text-left shadow-md shadow-[#28397F]/10 transition-colors hover:bg-white"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DE652E] text-white" aria-hidden="true">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16 0v-2a4 4 0 00-3-3.87M12 7a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 10-3-6.87" /></svg>
                    </span>
                    <p className="font-medium text-[#28397F] leading-snug">
                        ¿Eres mesero? <span className="block text-sm text-[#14502E] group-hover:text-[#B71F30]">Inicia sesión aquí</span>
                    </p>

                </Link>
            </div>
        </div>
    );
}
