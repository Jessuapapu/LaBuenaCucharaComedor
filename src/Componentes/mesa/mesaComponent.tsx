import { useNavigate } from 'react-router-dom';

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
