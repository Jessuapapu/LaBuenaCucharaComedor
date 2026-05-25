import { useState, useRef, useEffect } from "react";
import type { Orden, Detalles } from "../interfaces/comedor";
// Ajusta esta ruta a tu instancia de socket
import { WebSocketComedor } from "../config/socket";


const API_BASE_URL = import.meta.env.VITE_URL_API;
const token = localStorage.getItem("access_token");

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

                const opcionesFetch = {
                    headers: {
                        "Content-Type": "application/json",
                        // Inyectamos el Authorization solo si el token existe
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                };

                // 3. Le pasamos 'opcionesFetch' como segundo parámetro a cada fetch
                const [resActiva, resHistorial] = await Promise.all([
                    fetch(`${API_BASE_URL}/comedor/mesa/${idMesa}/true`, opcionesFetch),
                    fetch(`${API_BASE_URL}/comedor/mesa/${idMesa}/false`, opcionesFetch)
                ]);

                // Opcional: Interceptar un 401 (No autorizado) por si el token expiró
                if (resActiva.status === 401 || resHistorial.status === 401) {
                    console.error("Token expirado o inválido");
                    window.location.href = "/login";
                }

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
            const res = await fetch(`${API_BASE_URL}/ordenes/detalle/?IdPedido=${idOrden}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },

            });
            if (!res.ok) {
                window.location.href = "/login";
                throw new Error("Error obteniendo detalles");
            } 

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



// --- 1. CREAR NUEVA ORDEN ---
export function useCrearOrden() {
    const [cargando, setCargando] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const crear = (payload: any, onSuccess: () => void) => {
        if (cargando) return;
        setCargando(true);

        const limpiar = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_generada", onExito);
            WebSocketComedor.off("error_generar", onError);
        };

        const onExito = () => { limpiar(); setCargando(false); onSuccess(); };
        const onError = (data: any) => { limpiar(); setCargando(false); alert(data.MENSAJE); };

        WebSocketComedor.on("orden_generada", onExito);
        WebSocketComedor.on("error_generar", onError);

        timeoutRef.current = setTimeout(() => {
            limpiar(); setCargando(false); alert("Timeout: El servidor tardó más de 2 minutos.");
        }, 120000);

        WebSocketComedor.emit("crear_orden", payload);
    };

    useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
    return { crear, cargando };
}

// --- 2. ACTUALIZAR ORDEN EXISTENTE ---
export function useActualizarOrden() {
    const [cargando, setCargando] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const actualizar = (payload: any, onSuccess: () => void) => {
        if (cargando) return;
        setCargando(true);

        const limpiar = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_actualizar", onExito);
            WebSocketComedor.off("error_actualizar", onError);
        };

        const onExito = () => { limpiar(); setCargando(false); onSuccess(); };
        const onError = (data: any) => { limpiar(); setCargando(false); alert(data.MENSAJE); };

        WebSocketComedor.on("orden_actualizar", onExito);
        WebSocketComedor.on("error_actualizar", onError);

        timeoutRef.current = setTimeout(() => {
            limpiar(); setCargando(false); alert("Timeout: El servidor tardó más de 2 minutos.");
        }, 120000);

        WebSocketComedor.emit("actualizar_orden", payload);
    };

    useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
    return { actualizar, cargando };
}

// --- 3. CANCELAR ORDEN ---
export function useCancelarOrden() {
    const [cargando, setCargando] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelar = (payload: any, onSuccess: () => void) => {
        if (cargando) return;
        setCargando(true);

        const limpiar = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_actualizar", onExito);
            WebSocketComedor.off("error_actualizar", onError);
        };

        const onExito = () => { limpiar(); setCargando(false); onSuccess(); };
        const onError = (data: any) => { limpiar(); setCargando(false); alert(data.MENSAJE); };

        WebSocketComedor.on("orden_actualizar", onExito);
        WebSocketComedor.on("error_actualizar", onError);

        timeoutRef.current = setTimeout(() => {
            limpiar(); setCargando(false); alert("Timeout de cancelación superado.");
        }, 120000);

        WebSocketComedor.emit("cancelar_orden", payload);
    };

    useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
    return { cancelar, cargando };
}

// --- 4. GUARDAR ORDEN (COMPLETAR/PAGAR) ---
export function useGuardarOrden() {
    const [cargando, setCargando] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const guardar = (payload: any, onSuccess: () => void) => {
        if (cargando) return;
        setCargando(true);

        const limpiar = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_actualizar", onExito);
            WebSocketComedor.off("error_actualizar", onError);
        };

        const onExito = () => { limpiar(); setCargando(false); onSuccess(); };
        const onError = (data: any) => { limpiar(); setCargando(false); alert(data.MENSAJE); };

        WebSocketComedor.on("orden_actualizar", onExito);
        WebSocketComedor.on("error_actualizar", onError);

        timeoutRef.current = setTimeout(() => {
            limpiar(); setCargando(false); alert("Timeout de guardado superado.");
        }, 120000);

        WebSocketComedor.emit("guardar_orden", payload);
    };

    useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
    return { guardar, cargando };
}