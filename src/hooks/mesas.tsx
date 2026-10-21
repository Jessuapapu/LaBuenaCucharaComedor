import { useState, useEffect } from "react";
// Ajusta la ruta a tu socket y a la interfaz que creaste antes
import { WebSocketComedor } from "../config/socket";
import type { mesa } from "../interfaces/comedor"; 

// Ajusta a tu URL o lógica de carga inicial si la tienes diferente
const UrlApi = import.meta.env.VITE_URL_API;

export function useMesas() {
    const [numeroMesa, setNumeroMesa] = useState<mesa[]>([]);
    const [cargando, setCargando] = useState(true);

    // 1. Cargar las mesas iniciales por HTTP (REST normal al cargar la página)
    useEffect(() => {
        // Asegúrate de que esta URL coincida con tu endpoint real para obtener todas las mesas
        fetch(`${UrlApi}/comedor/NumeroMesas`) 
            .then(res => res.json())
            .then((data) => {
                setNumeroMesa(data);
            })
            .catch(err => console.error("Error al obtener las mesas iniciales:", err))
            .finally(() => setCargando(false));
    }, []);

    // 2. Escuchar los eventos WebSocket para actualizar en Tiempo Real
    useEffect(() => {
        // Evento: Se agregó una mesa desde administración
        const manejarAumentarMesa = (data: { IdMesa: number }) => {
            setNumeroMesa(prevMesas => [
                ...prevMesas,
                { id_mesa: data.IdMesa, Estado: false } // Se agrega libre (false) por defecto
            ]);
        };

        // Evento: Se quitó una mesa desde administración
        const manejarEliminarMesa = () => {
            setNumeroMesa(prevMesas => {
                if (prevMesas.length === 0) return prevMesas;
                // .slice(0, -1) crea una copia del array quitando exactamente el último elemento
                return prevMesas.slice(0, -1);
            });
        };

        // Nos suscribimos a los eventos
        WebSocketComedor.on("aumentar_mesa", manejarAumentarMesa);
        WebSocketComedor.on("eliminar_mesa", manejarEliminarMesa);

        // Limpieza de seguridad al desmontar el componente (evita escuchar doble)
        return () => {
            WebSocketComedor.off("aumentar_mesa", manejarAumentarMesa);
            WebSocketComedor.off("eliminar_mesa", manejarEliminarMesa);
        };
    }, []);

    return { numeroMesa, cargando };
}