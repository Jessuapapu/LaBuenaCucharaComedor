import { WebSocketComedor } from '../config/socket';
import type { ComedorOrdenIN, Detalles } from "../../interfaces/comedor";
import { useEstado } from '../hooks/estadocomedor';
import { useMesas } from '../hooks/mesas';

import { BotonMesa } from '../Componentes/mesa/mesaComponent';

// Función para enviar la orden por WebSocket (se mantiene igual)
export const EnviarOrden = (IdMesas: number, Detalless: Detalles[]) => {
    const ComedorOrden: ComedorOrdenIN = {
        IdMesa: IdMesas,
        Detalles: Detalless
    };
    WebSocketComedor.emit("crear_orden", ComedorOrden);
};

export function Indexs() {
    const estadoComedor = useEstado();
    const { numeroMesa } = useMesas();

    // PANTALLA: Error o Comedor Cerrado (Mismo diseño que MenuMesas)
    if (estadoComedor.error != null || estadoComedor.estado?.status === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <div className="bg-red-50 border border-red-200 p-8 rounded-3xl shadow-lg text-center max-w-sm">
                    <span className="text-5xl mb-4 block">😴</span>
                    <h1 className="text-2xl font-extrabold text-red-600 mb-2">Comedor Cerrado</h1>
                    <p className="text-red-400 font-medium">No se pueden tomar órdenes en este momento.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-[fade-in_0.3s_ease-out]">
            
            {/* CABECERA */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                        Mapa del Comedor
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Seleccione una mesa para tomar la orden</p>
                </div>
                
                {/* Indicador visual de estado activo */}
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide border border-emerald-200 shadow-sm w-max">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Turno Activo
                </div>
            </header>

            {/* CONTENEDOR DE MESAS */}
            <main className="max-w-7xl mx-auto">
                {numeroMesa && numeroMesa.length > 0 ? (
                    /* Cuadrícula adaptable: 2 columnas en celular, 3 en tablet, 4/5 en PC */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
                        
                        {/* Generamos los botones dinámicamente sin usar un for-loop externo */}
                        {Array.from({ length: numeroMesa.length }).map((_, index) => (
                            <div 
                                key={index} 
                                className="animate-[fade-in_0.5s_ease-out_both]" 
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <BotonMesa id={index + 1} />
                            </div>
                        ))}

                    </div>
                ) : (
                    /* PANTALLA: Sin mesas configuradas */
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-10">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No hay mesas configuradas</h3>
                        <p className="text-slate-500">Asegúrese de que la base de datos esté enviando el total de mesas correctamente.</p>
                    </div>
                )}
            </main>
            
        </div>
    );
}

export default Indexs;