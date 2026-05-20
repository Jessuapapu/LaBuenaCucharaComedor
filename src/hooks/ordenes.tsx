import { useState, useEffect } from "react";

// Interfaces basadas en los esquemas de tu backend
export interface Orden {
    IdOrden: number;
    HoraEntrada: string;
    HoraSalida: string | null;
    Activo: boolean;
}

export interface DetallePlatillo {
    id_orden: number;
    nombre_platillo: string;
    cantidad: number;
    precio_unitario: number;
}

const API_BASE_URL = import.meta.env.VITE_URL_API;

export function useOrdenesMesa(idMesa: string | undefined) {
    // Tipamos explícitamente los estados
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

                if (!resActiva.ok || !resHistorial.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const dataActiva = await resActiva.json();
                const dataHistorial: Orden[] = await resHistorial.json();

                // Manejo defensivo por si FastAPI retorna un array en la orden activa
                setOrdenActiva(Array.isArray(dataActiva) ? (dataActiva[0] as Orden || null) : (dataActiva as Orden));
                setHistorial(dataHistorial);
            } catch (err) {
                console.error("Error al cargar las órdenes:", err);
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
    const [detallesOrden, setDetallesOrden] = useState<DetallePlatillo[]>([]);
    const [cargandoDetalles, setCargandoDetalles] = useState<boolean>(false);

    const obtenerDetalle = async (idOrden: number) => {
        setCargandoDetalles(true);
        setDetallesOrden([]); 
        try {
            const res = await fetch(`${API_BASE_URL}/ordenes/detalle/?IdPedido=${idOrden}`);
            if (!res.ok) throw new Error("Error obteniendo detalles");
            
            const data: DetallePlatillo[] = await res.json();
            setDetallesOrden(data);
        } catch (error) {
            console.error("Error al cargar detalles:", error);
        } finally {
            setCargandoDetalles(false);
        }
    };

    const limpiarDetalles = () => setDetallesOrden([]);

    return { detallesOrden, cargandoDetalles, obtenerDetalle, limpiarDetalles };
}