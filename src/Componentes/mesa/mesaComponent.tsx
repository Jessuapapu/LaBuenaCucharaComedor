import { useNavigate } from 'react-router-dom';

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
