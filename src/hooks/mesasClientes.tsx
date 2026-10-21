import { useEffect } from 'react';
import { WebSocketComedor } from '../config/socket';

export function useRecargaMesa(idMesa: string | undefined) {
    useEffect(() => {
        if (!idMesa) return;

        const manejarRecargaMesa = (payload: any) => {
            
            // Si el backend avisa que esta mesa cambió, forzamos recarga
            if (payload && String(payload.IdMesa) === String(idMesa)) {
                window.location.reload();
            }
        };

        WebSocketComedor.on("orden_actualizada", manejarRecargaMesa);

        return () => {
            WebSocketComedor.off("orden_actualizada", manejarRecargaMesa);
        };
    }, [idMesa]);
}