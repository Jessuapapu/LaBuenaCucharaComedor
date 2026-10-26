import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMenu } from '../hooks/menu'; 
import type { Platillo } from '../interfaces/comedor';
import { useOrdenesMesa, useDetalleOrden } from '../hooks/ordenes';
import { useRecargaMesa } from '../hooks/mesasClientes';
import { CuentaClienteTable } from '../Componentes/ordenes/cuentaTable';
import { ImagenPlatilloWrapper } from '../Componentes/menu/ImagenPlatilloWrapper'; 

function TarjetaPlatilloCliente({ platillo }: { platillo: Platillo }) {
    const [colorDominante, setColorDominante] = useState("#FEC345");
    const guardarColor = useCallback((color: string) => setColorDominante(color), []);
    const precio = platillo.PrecioUnico ?? platillo.Monto ?? 0;

    return (
        <article
            className="relative mt-16 flex min-h-[300px] flex-col items-center justify-end rounded-[2rem] border border-[#28397F]/10 px-5 pb-6 pt-32 text-center shadow-lg shadow-[#28397F]/10"
            style={{ backgroundColor: `color-mix(in srgb, ${colorDominante} 12%, #FFF8E7)` }}
        >
            <div className="absolute -top-14 left-1/2 h-48 w-48 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white ring-8 ring-[#FFF8E7] shadow-xl sm:h-56 sm:w-56">
                <ImagenPlatilloWrapper nombrePlatillo={platillo.NombrePlatillo} onColorExtracted={guardarColor} />
            </div>
            <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight text-[#28397F] sm:text-3xl">{platillo.NombrePlatillo}</h3>
            <p className="mt-3 text-2xl font-black text-[#14502E] sm:text-3xl">C$ {precio.toFixed(2)}</p>
        </article>
    );
}

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

    const tieneOrden = Boolean(ordenActiva?.IdOrden);

    return (
        <div className="min-h-screen bg-[#FFF8E7] pb-24 font-sans">
            <section className="relative isolate min-h-[800px] overflow-hidden bg-[#FFF8E7] lg:min-h-[760px]">
                <div className="pointer-events-none absolute -right-28 -top-16 h-[350px] w-[350px] rounded-full bg-[#9DA968] md:-right-36 md:-top-40 md:h-[560px] md:w-[560px] lg:-right-32 lg:-top-20 lg:h-[830px] lg:w-[830px]" aria-hidden="true"></div>
                <div className="absolute -right-20 -top-10 h-[300px] w-[300px] overflow-hidden rounded-full border-[12px] border-[#9DA968] md:-right-28 md:-top-32 md:h-[500px] md:w-[500px] lg:-right-24 lg:-top-12 lg:h-[730px] lg:w-[730px]">
                    <img
                        src="/banner-comedor.png"
                        alt="Platillos de La Buena Cuchara"
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="relative z-10 mx-auto flex min-h-[800px] max-w-7xl flex-col items-center justify-end px-6 pb-14 pt-[270px] text-center lg:min-h-[760px] lg:max-w-7xl lg:items-start lg:justify-center lg:px-12 lg:pb-10 lg:pr-0 lg:pt-10 lg:text-left">
                    <div className="mb-7 flex w-full max-w-md items-center justify-between gap-3 lg:max-w-[48%]">
                        <Link
                            to="/"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#14502E]/20 bg-[#FFF8E7]/90 px-3 py-2.5 text-sm font-bold text-[#14502E] shadow-md backdrop-blur-sm transition hover:bg-white sm:px-4 sm:text-base"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a mesas
                        </Link>
                        <span className="shrink-0 rounded-lg bg-[#14502E] px-4 py-2 text-lg font-semibold text-[#FFF8E7] shadow-md sm:px-5 sm:text-xl">Mesa #{id}</span>
                    </div>
                    <div className="mb-2 flex flex-col items-center text-[#28397F] lg:max-w-[48%] lg:items-start">
                        <img src="/logo-cocinero.png" alt="Logo de La Buena Cuchara" className="mb-1 h-48 w-48 object-contain sm:h-56 sm:w-56 lg:h-64 lg:w-64" />
                        <p className="text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl">La Buena</p>
                    </div>
                    <h1 className="font-serif text-6xl font-black leading-none tracking-tight text-[#17130f] sm:text-7xl lg:max-w-[48%] lg:text-8xl">Cuchara</h1>
                    <div className="mt-9 inline-flex max-w-full rounded-xl bg-[#8D5A24] px-5 py-2 text-2xl font-black leading-tight text-white shadow-md sm:px-6 sm:text-3xl lg:max-w-[48%]">
                        {tieneOrden ? 'Tu mesa está en servicio' : 'Tu mesa está libre'}
                    </div>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-[#241b17] sm:text-xl lg:max-w-[48%]">
                        {tieneOrden
                            ? 'Tu orden está en curso. Puedes revisar el detalle más abajo.'
                            : 'Revisa el menú del día y llama al mesero para ordenar.'}
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl space-y-12 px-5 py-12">
                {tieneOrden && (
                    <section>
                        <CuentaClienteTable detalles={detallesOrden} ordenActivaId={ordenActiva?.IdOrden} />
                    </section>
                )}

                <section className="pt-4">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Menú</h2>
                            <p className="text-slate-500 font-medium mt-1">Especialidades del día</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                        {menu.map((platillo) => (
                            <TarjetaPlatilloCliente key={platillo.id} platillo={platillo} />
                        ))}
                    </div>
                </section>
                <div className="h-10"></div>
            </main>
        </div>
    );
}
