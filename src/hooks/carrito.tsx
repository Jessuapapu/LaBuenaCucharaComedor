import { useState } from "react";
import type { ItemCarrito } from "../interfaces/comedor"; 
import { useCrearOrden, useActualizarOrden } from './ordenes'

// Recibimos idOrdenActiva para saber si creamos o actualizamos
export function useCarrito(idMesa: string | undefined, idOrdenActiva: number | null) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    
    // Instanciamos los hooks de socket
    const { crear, cargando: creando } = useCrearOrden();
    const { actualizar, cargando: actualizando } = useActualizarOrden();

    const agregarAlCarrito = (platillo: any) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id_platillo === platillo.id);
            if (existe) {
                return prev.map(item => 
                    item.id_platillo === platillo.id 
                    ? { ...item, cantidad: item.cantidad + 1 } : item
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

    const limpiarCarrito = () => setCarrito([]);

    const totalCarrito = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const enviarPedido = (alTerminarExito: () => void) => {
        if (carrito.length === 0 || !idMesa || creando || actualizando) return;

        const payload = {
            IdMesa: parseInt(idMesa),
            Detalles: carrito.map(({ nombre_platillo, cantidad, precio_unitario }) => ({
                nombre_platillo,
                cantidad,
                precio_unitario
            }))
        };

        const onExito = () => {
            limpiarCarrito();
            alTerminarExito();
        };

        // LÓGICA DE BIFURCACIÓN (Punto 1 y 2)
        if (!idOrdenActiva) {
            crear(payload, onExito);
        } else {
            actualizar(payload, onExito);
        }
    };

    return { 
        carrito, 
        agregarAlCarrito, 
        modificarCantidad, 
        totalCarrito, 
        cantidadItems, 
        enviarPedido, 
        // El estado de carga global será verdadero si cualquiera de los dos está cargando
        enviandoOrden: creando || actualizando 
    };
}