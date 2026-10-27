const UrlApi = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8001';
import { useState, useEffect, useCallback } from 'react';
import { WebSocketComedor } from '../config/socket';

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
});

export const apiCaja = {
    obtenerCaja: async () => fetch(`${UrlApi}/caja/`, { headers: getHeaders() }).then(r => r.json()),
    obtenerEstado: async () => fetch(`${UrlApi}/caja/Estado`, { headers: getHeaders() }).then(r => r.json()),
    abrirCaja: async () => fetch(`${UrlApi}/caja/abrir`, { method: "PUT", headers: getHeaders() }).then(r => r.json()),
    cerrarCaja: async () => fetch(`${UrlApi}/caja/cerrar`, { method: "PUT", headers: getHeaders() }).then(r => r.json()),
    
    pagarOrden: async (payload: any) => fetch(`${UrlApi}/caja/pagar`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(payload) }).then(r => r.json()),
    finalizarOrden: async (idOrden: number) => fetch(`${UrlApi}/caja/finalizar/${idOrden}`, { method: "POST", headers: getHeaders() }).then(r => r.json()),
    
    // 🆕 NUEVOS ENDPOINTS:
    anularOrden: async (idOrden: number) => fetch(`${UrlApi}/caja/${idOrden}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),
    actualizarMonto: async (payload: {IdOrden: number, Monto: number}) => fetch(`${UrlApi}/caja/actualizar`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(payload) }).then(r => r.json()),
    reembolsarOrden: async (payload: {IdOrden: number, Monto: number, Razon: string}) => fetch(`${UrlApi}/caja/reembolso`, { method: "POST", headers: getHeaders(), body: JSON.stringify(payload) }).then(r => r.json()),
    
    // Para ver los detalles extraídos directamente de la BD sin caché
    obtenerDetalles: async (idOrden: number) => fetch(`${UrlApi}/ordenes/detalle/?IdPedido=${idOrden}&t=${new Date().getTime()}`, { headers: { 'Cache-Control': 'no-cache' } }).then(r => r.json())
};




export function useCaja() {
    const [estadoCaja, setEstadoCaja] = useState(false);
    const [datosCaja, setDatosCaja] = useState<any>(null);
    const [cargando, setCargando] = useState(true);

    const cargarCaja = useCallback(async () => {
        try {
            const resEstado = await apiCaja.obtenerEstado();
            setEstadoCaja(resEstado.status);
            
            if (resEstado.status) {
                const data = await apiCaja.obtenerCaja();
                setDatosCaja(data);
            } else {
                setDatosCaja(null);
            }
        } catch (error) {
            console.error("Error al cargar la caja:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarCaja();

        // Escuchar los WebWebSocketComedors que configuramos en tu backend
        WebSocketComedor.on('actualizar_caja', (data) => {
            if (data && data.HoraApertura) setDatosCaja(data); // Payload completo
            else cargarCaja(); // Si llega un payload parcial, recargamos
        });
        
        WebSocketComedor.on('estado_caja', (data) => {
            setEstadoCaja(data.estado);
            if (!data.estado) setDatosCaja(null);
        });

        return () => {
            WebSocketComedor.off('actualizar_caja');
            WebSocketComedor.off('estado_caja');
        };
    }, [cargarCaja]);

    const abrirCaja = async () => {
        const res = await apiCaja.abrirCaja();
        if (res.status) cargarCaja();
        return res.status;
    };

    const cerrarCaja = async () => {
        const res = await apiCaja.cerrarCaja();
        if (res.status) cargarCaja();
        return res.status;
    };

    return { estadoCaja, datosCaja, cargando, abrirCaja, cerrarCaja, refetch: cargarCaja };
}