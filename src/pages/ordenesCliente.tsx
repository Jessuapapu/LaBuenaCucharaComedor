import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMenu } from '../hooks/menu'; 
import { useOrdenesMesa, useDetalleOrden } from '../hooks/ordenes';
import { useRecargaMesa } from '../hooks/mesasClientes';
import { CuentaClienteTable } from '../Componentes/ordenes/cuentaTable';
import { ImagenPlatilloWrapper } from '../Componentes/menu/ImagenPlatilloWrapper'; 

export function VistaClienteMesa() {
    const { id } = useParams<{ id: string }>();

    // 1. Hooks de datos HTTP
    const { menu, cargando: cargandoMenu } = useMenu();
    const { ordenActiva, cargando: cargandoOrden } = useOrdenesMesa(id);
    const { detallesOrden, obtenerDetalle, cargandoDetalles } = useDetalleOrden();

    // 2. Hook de Tiempo Real (Vigila y recarga si es necesario)
    useRecargaMesa(id);

    // 3. Carga inicial
    useEffect(() => {
        if (ordenActiva && ordenActiva.IdOrden) {
            obtenerDetalle(ordenActiva.IdOrden);
        }
    }, [ordenActiva]);

    if (cargandoMenu || cargandoOrden || cargandoDetalles) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-orange-100 font-bold tracking-widest uppercase text-sm">Preparando mesa...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Encabezado Premium */}
            <header className="bg-slate-900 text-white pt-12 pb-28 px-6 rounded-b-[3rem] shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <p className="text-orange-500 font-black tracking-[0.2em] text-xs uppercase mb-3">Bienvenidos a</p>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">La Buena Cuchara</h1>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl mt-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-medium text-slate-200 text-sm">Mesa <b className="text-white text-lg ml-1">{id}</b></span>
                    </div>
                </div>
            </header>

            <main className="max-w-md md:max-w-4xl mx-auto px-5 -mt-16 relative z-20 space-y-12">
                <section>
                    <CuentaClienteTable detalles={detallesOrden} ordenActivaId={ordenActiva?.IdOrden} />
                </section>

                <section className="pt-4">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Menú</h2>
                            <p className="text-slate-500 font-medium mt-1">Especialidades del día</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {menu.map((platillo) => (
                            <div key={platillo.id} className="relative w-full h-80 sm:h-96 rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] bg-slate-200">
                                <div className="absolute inset-0">
                                    <ImagenPlatilloWrapper idPlatillo={0} nombrePlatillo={platillo.NombrePlatillo} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                                <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-2xl font-black text-lg shadow-lg">
                                    C${(platillo.PrecioUnico || platillo.Monto || 0).toFixed(2)}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                                    <h3 className="font-black text-3xl text-white leading-tight mb-3 drop-shadow-md">{platillo.NombrePlatillo}</h3>
                                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                        <span className="bg-orange-500 w-2 h-2 rounded-full"></span> Disponible para ordenar
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <div className="h-10"></div>
            </main>
        </div>
    );
}