import { useState, useEffect, useRef } from "react";
import type { ItemCarrito } from "../../interfaces/comedor"; 
// Ajusta esta ruta a donde tengas tu instancia de socket.io-client configurada
import { WebSocketComedor } from "../config/socket"

export function useCarrito(idMesa: string | undefined, idOrdenActiva: number | null) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [enviandoOrden, setEnviandoOrden] = useState<boolean>(false);
    
    // Usamos useRef para mantener la referencia del timeout y poder limpiarlo si el componente se desmonta
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);;

    const agregarAlCarrito = (platillo: any) => {
        // ... (Tu lógica de agregarAlCarrito se mantiene intacta)
        setCarrito(prev => {
            const existe = prev.find(item => item.id_platillo === platillo.id);
            if (existe) {
                return prev.map(item => 
                    item.id_platillo === platillo.id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            return [...prev, { 
                id_platillo: platillo.id, 
                nombre_platillo: platillo.NombrePlatillo, 
                cantidad: 1, 
                precio_unitario: platillo.Monto || 0 
            }];
        });
    };

    const modificarCantidad = (idPlatillo: number, delta: number) => {
        setCarrito(prev => prev.map(item => {
            if (item.id_platillo === idPlatillo) {
                return { ...item, cantidad: item.cantidad + delta };
            }
            return item;
        }).filter(item => item.cantidad > 0)); 
    };

    const totalCarrito = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const enviarPedido = (alTerminarExito: () => void) => {
        if (carrito.length === 0 || !idMesa || enviandoOrden) return;
        
        setEnviandoOrden(true);

        const payload = {
            IdMesa: parseInt(idMesa),
            Detalles: carrito.map(({ nombre_platillo, cantidad, precio_unitario }) => ({
                nombre_platillo,
                cantidad,
                precio_unitario
            }))
        };

        // --- MANEJADORES DE EVENTOS DE SOCKET ---
        const limpiarEventosYTimeout = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_generada", manejarExitoCreacion);
            WebSocketComedor.off("error_generar", manejarError);
            // Aquí agregaremos luego los .off() del Punto 2
        };

        const manejarExitoCreacion = (_data: any) => {
            // data traerá { IdMesa, IdOrden } según tu backend
            limpiarEventosYTimeout();
            setCarrito([]); 
            setEnviandoOrden(false);
            alTerminarExito();
        };

        const manejarError = (data: any) => {
            // data traerá { MENSAJE } según tu backend
            limpiarEventosYTimeout();
            setEnviandoOrden(false);
            alert(data.MENSAJE || "Hubo un error en el servidor al procesar la orden.");
        };

        // Suscribimos los listeners
        WebSocketComedor.on("orden_generada", manejarExitoCreacion);
        WebSocketComedor.on("error_generar", manejarError);

        // --- TIMEOUT DE 2 MINUTOS (120,000 ms) ---
        timeoutRef.current = setTimeout(() => {
            limpiarEventosYTimeout();
            setEnviandoOrden(false);
            alert("Tiempo de espera agotado (2 minutos). El servidor no respondió, por favor verifica si la orden se creó o intenta de nuevo.");
        }, 120000);

        // --- EMISIÓN DEL EVENTO ---
        if (!idOrdenActiva) {
            // PUNTO 1: NO HAY ORDEN ACTIVA -> CREAMOS UNA NUEVA
            WebSocketComedor.emit("crear_orden", payload);
        } else {
            // PUNTO 2: HAY ORDEN ACTIVA -> AGREGAMOS A LA EXISTENTE
            // TODO: Ajustar este evento y payload cuando me pases la función del backend
            console.log("Enviando a orden activa:", idOrdenActiva);
            // WebSocketComedor.emit("agregar_detalles_orden", { IdOrden: idOrdenActiva, Detalles: payload.Detalles });
            
            // Simulación temporal para que no se quede pegado mientra me pasas el back:
            setTimeout(() => manejarExitoCreacion({}), 1000); 
        }
    };

    // Cleanup de seguridad por si el usuario cambia de página mientras carga
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            WebSocketComedor.off("orden_generada");
            WebSocketComedor.off("error_generar");
        };
    }, []);

    return { 
        carrito, 
        agregarAlCarrito, 
        modificarCantidad, 
        totalCarrito, 
        cantidadItems, 
        enviarPedido, 
        enviandoOrden 
    };
}