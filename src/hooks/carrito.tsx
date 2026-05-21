import { useState } from "react";
import type { ItemCarrito } from "../../interfaces/comedor"; 

const UrlApiOrdenes = import.meta.env.VITE_URL_API;


// Interface interna que extiende Detalles para necesitar un ID (para modificar/eliminar del array)

export function useCarrito(idMesa: string | undefined) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [enviandoOrden, setEnviandoOrden] = useState<boolean>(false);

    const agregarAlCarrito = (platillo: any) => {
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
                precio_unitario: platillo.PrecioUnico || 0 
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

    const enviarPedido = async (alTerminarExito: () => void) => {
        if (carrito.length === 0 || !idMesa) return;
        setEnviandoOrden(true);

        const payload = {
            IdMesa: parseInt(idMesa),
            Detalles: carrito.map(({ nombre_platillo, cantidad, precio_unitario }) => ({
                nombre_platillo,
                cantidad,
                precio_unitario
            }))
        };

        try {
            const respuesta = await fetch(`${UrlApiOrdenes}/comedor/${idMesa}`, {
                method: 'POST',
                headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!respuesta.ok) throw new Error("Error al enviar la orden");

            setCarrito([]); 
            alTerminarExito(); // Ejecutamos un callback (ej. recargar la vista, lanzar una alerta)
            
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al enviar la orden a cocina.");
        } finally {
            setEnviandoOrden(false);
        }
    };

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