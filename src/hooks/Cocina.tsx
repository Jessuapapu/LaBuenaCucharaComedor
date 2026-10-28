import { useState, useEffect, useCallback } from 'react';
import { cocinaService } from './cocinaServices';
import type { OrdenCocina } from '../interfaces/Cocina';
import { WebSocketComedor } from '../config/socket';

export function useCocina() {
  const [ordenes, setOrdenes] = useState<OrdenCocina[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [notificacion, setNotificacion] = useState<{ visible: boolean, msj: string, tipo: 'nueva' | 'modificada' } | null>(null);

  const reproducirAlerta = (tipo: 'nueva' | 'modificada') => {
    if (navigator.vibrate) {
      tipo === 'nueva' ? navigator.vibrate([200, 100, 200]) : navigator.vibrate([100, 50, 100]);
    }

    const audioSrc = '/sounds/notificacion.mp3';
    const audio = new Audio(audioSrc);
    audio.volume = 1.0;
    
    audio.play().catch(e => {
      console.warn("Autoplay bloqueado. El usuario debe tocar la pantalla primero.", e);
    });
  };

  const mostrarNotificacion = (msj: string, tipo: 'nueva' | 'modificada') => {
    reproducirAlerta(tipo);
    setNotificacion({ visible: true, msj, tipo });
    
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  const cargarOrdenes = async () => {
    try {
      const data = await cocinaService.obtenerOrdenesActivas();
      setOrdenes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();

    const handleNuevaOrden = (data: any) => {
      mostrarNotificacion(`¡NUEVA ORDEN EN MESA ${data.IdMesa}!`, 'nueva');
      cargarOrdenes();
    };

    const handleOrdenActualizada = (data: any) => {
      mostrarNotificacion(`¡ORDEN MODIFICADA EN MESA ${data.IdMesa}!`, 'modificada');
      cargarOrdenes();
    };

     WebSocketComedor.on("orden_generada", handleNuevaOrden);
     WebSocketComedor.on("orden_actualizada", handleOrdenActualizada);

    return () => {
       WebSocketComedor.off("orden_generada", handleNuevaOrden);
       WebSocketComedor.off("orden_actualizada", handleOrdenActualizada);
    };
  }, []);

  const marcarOrdenLista = useCallback((idMesa: number, idOrden: number) => {
     WebSocketComedor.emit("actualizar_cocina", { id_mesa: idMesa, id_orden: idOrden });
    setOrdenes(prev => prev.filter(o => o.IdOrden !== idOrden));
  }, []);

  return { ordenes, cargando, notificacion, marcarOrdenLista };
}