<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useImagenPlatillo } from "../../hooks/imagenes";
import type { Props } from "../../interfaces/comedor";


function extraerColorDominante(imagen: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const contexto = canvas.getContext("2d", { willReadFrequently: true });
    if (!contexto) return null;

    contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
    const pixeles = contexto.getImageData(0, 0, canvas.width, canvas.height).data;
    const grupos = new Map<string, { r: number; g: number; b: number; cantidad: number }>();

    for (let i = 0; i < pixeles.length; i += 16) {
        const r = pixeles[i];
        const g = pixeles[i + 1];
        const b = pixeles[i + 2];
        const alpha = pixeles[i + 3];
        if (alpha < 200) continue;

        const clave = `${Math.round(r / 32)}-${Math.round(g / 32)}-${Math.round(b / 32)}`;
        const grupo = grupos.get(clave) ?? { r: 0, g: 0, b: 0, cantidad: 0 };
        grupo.r += r;
        grupo.g += g;
        grupo.b += b;
        grupo.cantidad += 1;
        grupos.set(clave, grupo);
    }

    const dominante = [...grupos.values()].sort((a, b) => b.cantidad - a.cantidad)[0];
    if (!dominante) return null;

    const r = Math.round(dominante.r / dominante.cantidad);
    const g = Math.round(dominante.g / dominante.cantidad);
    const b = Math.round(dominante.b / dominante.cantidad);
    return `rgb(${r}, ${g}, ${b})`;
}

export function ImagenPlatilloWrapper({ nombrePlatillo, onColorExtracted }: Props) {
    const { Urlimagen, cargando, error } = useImagenPlatillo(nombrePlatillo);
    const [imagenFallida, setImagenFallida] = useState(false);

    useEffect(() => setImagenFallida(false), [Urlimagen]);

    if (cargando) {
        return (
            <div className="w-full h-full bg-[#FEC345]/30 animate-pulse flex items-center justify-center">
                <span className="text-xs text-[#28397F]/60 font-bold">Cargando foto...</span>
=======
import { useImagenPlatillo } from "../../hooks/imagenes"; // Ajusta la ruta a donde tengas tu hook
import type { Props } from "../../interfaces/comedor";


export function ImagenPlatilloWrapper({ nombrePlatillo }: Props) {

    const { Urlimagen, cargando, error } = useImagenPlatillo( nombrePlatillo);

    if (cargando) {
        return (
            <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-xs text-slate-400 font-bold">Cargando...</span>
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
            </div>
        );
    }

<<<<<<< HEAD
    if (error || !Urlimagen || imagenFallida) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#FFF8E7] text-[#14502E]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="5.5" strokeWidth="1.5" />
                </svg>
                <span className="text-[10px] font-semibold">Foto pendiente</span>
=======
    if (error || !Urlimagen) {
        return (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium text-center px-1">Sin Imagen</span>
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
            </div>
        );
    }

<<<<<<< HEAD
=======
    // Retorna la imagen apuntando al string (URL de Supabase) que tu hook devolvió
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
    return (
        <img 
            src={Urlimagen} 
            alt={nombrePlatillo}
            className="w-full h-full object-cover transition-opacity duration-300"
<<<<<<< HEAD
            onLoad={(e) => {
                try {
                    const color = extraerColorDominante(e.currentTarget);
                    if (color) onColorExtracted?.(color);
                } catch {
                    // Si el servidor no permite leer los píxeles, la tarjeta conserva su color de respaldo.
                }
            }}
            onError={(e) => {
                setImagenFallida(true);
            }}
        />
    );
}
=======
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
