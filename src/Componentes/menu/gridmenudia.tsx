import { useCallback, useState } from "react";
import { ImagenPlatilloWrapper } from "./ImagenPlatilloWrapper";
import type { MenuDiaGridProps, Platillo } from "../../interfaces/comedor";

function TarjetaPlatilloMesero({ platillo, alAgregar }: { platillo: Platillo; alAgregar: (nombre: string, precio: number) => void }) {
    const [colorDominante, setColorDominante] = useState("#FEC345");
    const guardarColor = useCallback((color: string) => setColorDominante(color), []);
    const precio = platillo.Monto ?? platillo.PrecioUnico ?? 0;

    return (
        <article
            className="relative mt-16 flex min-h-[320px] flex-col items-center justify-end rounded-[2rem] border border-[#28397F]/10 px-5 pb-5 pt-32 text-center shadow-md shadow-[#28397F]/10 transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: `color-mix(in srgb, ${colorDominante} 12%, #FFF8E7)` }}
        >
            <div className="absolute -top-14 left-1/2 h-48 w-48 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white ring-8 ring-[#FFF8E7] shadow-xl sm:h-56 sm:w-56">
                <ImagenPlatilloWrapper nombrePlatillo={platillo.NombrePlatillo} onColorExtracted={guardarColor} />
            </div>
            <div className="mb-4">
                <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-[#28397F] sm:text-2xl">{platillo.NombrePlatillo}</h3>
                <p className="mt-2 text-xl font-black text-[#14502E] sm:text-2xl">C$ {precio.toFixed(2)}</p>
            </div>
            <button
                onClick={() => alAgregar(platillo.NombrePlatillo, precio)}
                className="w-full max-w-48 rounded-xl bg-[#28397F] px-2 py-2 text-xs font-bold text-white transition-colors hover:bg-[#14502E] active:scale-95 sm:text-sm"
            >
                + Añadir
            </button>
        </article>
    );
}

export function MenuDiaGrid({ cargando, listaMenu, alAgregar }: MenuDiaGridProps) {
    if (cargando) {
        return <div className="flex justify-center py-10"><span className="animate-pulse text-slate-500 font-bold">Cargando menú...</span></div>;
    }

    if (listaMenu.length === 0) {
        return <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center"><p className="text-slate-400 font-medium">No hay platillos disponibles hoy.</p></div>;
    }

    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {listaMenu.map((platillo) => (
                <TarjetaPlatilloMesero key={platillo.id} platillo={platillo} alAgregar={alAgregar} />
            ))}
        </div>
    );
}
