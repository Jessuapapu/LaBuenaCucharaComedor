import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
interface BotonMesaProps {
    id: number | string;
    estado?: 'libre' | 'ocupada'; 
}

export function BotonMesa({ id, estado = 'libre' }: BotonMesaProps) {
    const navigate = useNavigate();

    const colorMesa = estado === 'libre'
        ? 'bg-gradient-to-br from-[#267347] to-[#14502E] shadow-[#14502E]/30'
        : 'bg-gradient-to-br from-[#D23B49] to-[#9F1C2A] shadow-[#B71F30]/30';
    const colorSilla = estado === 'libre' ? 'bg-[#7FA78A]' : 'bg-[#D98489]';

    return (
        <button 
            onClick={() => navigate(`/mesa/${id}`)}
            title={`Ir a la mesa ${id}`}
            className="group relative m-4 flex h-24 w-24 transform items-center justify-center rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FEC345] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F0E2] active:scale-95"
        >
            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full ${colorSilla} transition-transform duration-300 group-hover:-translate-y-1`}></div>
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full ${colorSilla} transition-transform duration-300 group-hover:translate-y-1`}></div>
            <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-8 rounded-full ${colorSilla} transition-transform duration-300 group-hover:-translate-x-1`}></div>
            <div className={`absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-8 rounded-full ${colorSilla} transition-transform duration-300 group-hover:translate-x-1`}></div>
            
            <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/65 shadow-lg ring-4 ring-white/40 transition-colors duration-300 ${colorMesa}`}>
                <span className="text-white font-extrabold text-2xl drop-shadow-md z-20">{id}</span>
            </div>
        </button>
    );
}
=======
export interface BotonMesaProps {
    id: number | string;
    estado?: 'libre' | 'ocupada' | 'reservada';
}

const UI_ESTADOS = {
    libre: {
        borde: 'border-emerald-500/30',
        fondo: 'bg-emerald-500/5 hover:bg-emerald-500/10',
        brillo: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]',
        texto: 'text-emerald-500',
        sillas: 'bg-emerald-500/40 group-hover:bg-emerald-500',
    },
    ocupada: {
        borde: 'border-red-500/30',
        fondo: 'bg-red-500/5 hover:bg-red-500/10',
        brillo: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
        texto: 'text-red-500',
        sillas: 'bg-red-500/40',
    },
    reservada: {
        borde: 'border-amber-500/30',
        fondo: 'bg-amber-500/5 hover:bg-amber-500/10',
        brillo: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]',
        texto: 'text-amber-500',
        sillas: 'bg-amber-500/40',
    }
} as const;

export function BotonMesa({ id, estado = 'libre' }: BotonMesaProps) {
    const navigate = useNavigate();
    const ui = UI_ESTADOS[estado] || UI_ESTADOS.libre;

    return (
        <button
            onClick={() => navigate(`/mesa/${id}`)}
            className={`relative group w-32 h-32 m-4 rounded-3xl border-2 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${ui.borde} ${ui.fondo}`}
        >
            {/* Indicador de estado (Punto brillante tipo LED) */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${ui.brillo} transition-all duration-300 ${estado === 'libre' ? 'animate-pulse' : ''}`} />

            {/* Número de Mesa */}
            <span className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${ui.texto}`}>
                {id}
            </span>
            
            {/* Etiqueta de texto (Aparece suavemente al pasar el mouse) */}
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {estado}
            </span>

            {/* Sillas minimalistas (Líneas integradas en el borde inferior) */}
            <div className="absolute -bottom-1.5 flex gap-2">
                {[1, 2, 3, 4].map((silla) => (
                    <div 
                        key={silla} 
                        className={`w-4 h-2.5 rounded-full transition-all duration-300 ${ui.sillas} ${estado === 'libre' ? 'group-hover:-translate-y-1' : ''}`} 
                    />
                ))}
            </div>
        </button>
    );
}
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
