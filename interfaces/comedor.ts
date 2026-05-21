export interface ComedorOrdenIN{
    IdMesa: number 
    Detalles: Detalles[]
}

export interface Detalles {
    nombre_platillo: string;
    cantidad: number;
    precio_unitario: number;
}

export interface mesa{
    id_mesa: number;
    Estado: boolean;
}


export interface Platillo {
  id: number;
  Fecha: string;
  NombrePlatillo: string;
  PrecioUnico?: number;
}

export interface estadoComedor{
    msj: string;
    status: boolean;
}


export interface ModalDetalleOrdenProps {
    abierto: boolean;
    cargando: boolean;
    detalles: Detalles[];
    alCerrar: () => void;
}

export interface Orden {
    IdOrden: number;
    HoraEntrada: string;
    HoraSalida: string | null;
    Activo: boolean;
}

export interface BotonMesaProps {
    id: number | string;
    // Opcional: Podrías pasar el estado para cambiar el color
    estado?: 'libre' | 'ocupada'; 
}

export interface ModalDetalleOrdenProps {
    abierto: boolean;
    cargando: boolean;
    detalles: Detalles[];
    alCerrar: () => void;
    esActiva?: boolean; // Saber si mostramos el botón de añadir
    alAgregarPlatillos?: () => void; // Función para navegar al menú
}


export interface BarraCarritoProps {
    carrito: ItemCarrito[];
    modificarCantidad: (idPlatillo: number, delta: number) => void;
    enviarPedido: () => void;
    enviandoOrden: boolean;
    totalCarrito: number;
    cantidadItems: number;
}

export interface ItemCarrito extends Detalles {
    id_platillo: number; 
}
