import { useState, useEffect } from "react";
import type { Orden, Detalles } from "../../interfaces/comedor";


const API_BASE_URL = import.meta.env.VITE_URL_API;

export function useOrdenesMesa(idMesa: string | undefined) {
    const [ordenActiva, setOrdenActiva] = useState<Orden | null>(null);
    const [historial, setHistorial] = useState<Orden[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!idMesa) return;

        const cargarOrdenes = async () => {
            setCargando(true);
            try {
                const [resActiva, resHistorial] = await Promise.all([
                    fetch(`${API_BASE_URL}/comedor/mesa/${idMesa}/true`),
                    fetch(`${API_BASE_URL}/comedor/mesa/${idMesa}/false`)
                ]);

                if (!resActiva.ok || !resHistorial.ok) throw new Error("Error en el servidor");

                const dataActiva = await resActiva.json();
                const dataHistorial: Orden[] = await resHistorial.json();

                setOrdenActiva(Array.isArray(dataActiva) ? (dataActiva[0] || null) : dataActiva);
                setHistorial(dataHistorial);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setCargando(false);
            }
        };

        cargarOrdenes();
    }, [idMesa]);

    return { ordenActiva, historial, cargando, error };
}

export function useDetalleOrden() {
    const [detallesOrden, setDetallesOrden] = useState<Detalles[]>([]);
    const [cargandoDetalles, setCargandoDetalles] = useState<boolean>(false);

    const obtenerDetalle = async (idOrden: number) => {
        setCargandoDetalles(true);
        setDetallesOrden([]); 
        try {
            const res = await fetch(`${API_BASE_URL}/ordenes/detalle/?IdPedido=${idOrden}`);
            if (!res.ok) throw new Error("Error obteniendo detalles");
            
            const data: Detalles[] = await res.json();
            setDetallesOrden(data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoDetalles(false);
        }
    };

    const limpiarDetalles = () => setDetallesOrden([]);

    return { detallesOrden, cargandoDetalles, obtenerDetalle, limpiarDetalles };
}