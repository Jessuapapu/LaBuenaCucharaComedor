import { useState, useEffect } from "react";
import type { ModalPlatilloExtraProps, PlatilloExtraDB } from "../../../interfaces/comedor";

const UrlApi = import.meta.env.VITE_URL_API 

export function ModalPlatilloExtra({ abierto, alCerrar, alConfirmar }: ModalPlatilloExtraProps) {
    const [busqueda, setBusqueda] = useState("");
    const [precio, setPrecio] = useState<number | "">("");
    const [cantidad, setCantidad] = useState<number>(1);
    
    const [platillosDb, setPlatillosDb] = useState<PlatilloExtraDB[]>([]);
    const [cargandoDb, setCargandoDb] = useState(false);

    useEffect(() => {
        if (abierto && platillosDb.length === 0) {
            setCargandoDb(true);
            fetch(`${UrlApi}/platillos/`)
                .then(res => res.json())
                .then((data: PlatilloExtraDB[]) => setPlatillosDb(data))
                .catch(err => console.error("Error cargando platillos:", err))
                .finally(() => setCargandoDb(false));
        }
    }, [abierto, platillosDb.length]);

    useEffect(() => {
        if (!abierto) {
            setBusqueda(""); setPrecio(""); setCantidad(1);
        }
    }, [abierto]);

    if (!abierto) return null;

    const manejarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!busqueda || precio === "") return;
        alConfirmar(busqueda, Number(precio), cantidad);
        alCerrar();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[scale-in_0.2s_ease-out]">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-xl text-slate-800">Agregar Platillo Extra</h3>
                    <button onClick={alCerrar} className="text-slate-400 hover:text-red-500 bg-white rounded-full p-2 shadow-sm transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={manejarSubmit} className="p-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Buscar Platillo</label>
                        <input 
                            type="text"
                            list="lista-platillos"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder={cargandoDb ? "Cargando base de datos..." : "Escribe para buscar..."}
                            disabled={cargandoDb}
                            required
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <datalist id="lista-platillos">
                            {platillosDb.map((p, i) => (
                                <option key={i} value={p.nombre_platillo}>{p.nombre_categoria}</option>
                            ))}
                        </datalist>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Precio (C$)</label>
                            <input 
                                type="number" 
                                min="0" 
                                step="any"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
                                required
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Cantidad</label>
                            <input 
                                type="number" 
                                min="1" 
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                required
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={cargandoDb || !busqueda || precio === ""}
                        className="w-full mt-2 bg-slate-900 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                        Añadir a la Orden
                    </button>
                </form>
            </div>
        </div>
    );
}