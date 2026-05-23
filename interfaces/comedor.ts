export interface ComedorOrdenIN {
    IdMesa: number;
    Detalles: Detalles[];
}

export interface Detalles {
    nombre_platillo: string;
    cantidad: number;
    precio_unitario: number;
}

export interface mesa {
    id_mesa: number;
    Estado: boolean;
}

export interface Platillo {
    id: number;
    Fecha: string;
    NombrePlatillo: string;
    Monto?: number;
    PrecioUnico?: number; 
}

export interface estadoComedor {
    msj: string;
    status: boolean;
}

export interface Orden {
    IdOrden: number;
    HoraEntrada: string;
    HoraSalida: string | null;
    Activo: boolean;
}

export interface BotonMesaProps {
    id: number | string;
    estado?: 'libre' | 'ocupada'; 
}

export interface ModalDetalleOrdenProps {
    abierto: boolean;
    cargando: boolean;
    detalles: Detalles[];
    alCerrar: () => void;
    esActiva?: boolean; 
    alAgregarPlatillos?: () => void; 
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

export interface MenuDiaGridProps {
    cargando: boolean;
    listaMenu: Platillo[];
    alAgregar: (nombre: string, precio: number) => void;
}

export interface OrdenActivaTableProps {
    detalles: Detalles[];
    ordenActivaId: number | null;
    cargandoAccion: boolean;
    alModificarCantidad: (nombre: string, delta: number) => void;
    alCrearOActualizar: () => void;
    alTerminarOrden: () => void;
    alCancelarOrden: () => void; // NUEVO
}

export interface ModalPlatilloExtraProps {
    abierto: boolean;
    alCerrar: () => void;
    alConfirmar: (nombre: string, precio: number, cantidad: number) => void;
}

export interface PlatilloExtraDB {
    nombre_platillo: string;
    nombre_categoria: string;
}


export interface ModalDialogoProps {
    abierto: boolean;
    tipo: 'exito' | 'peligro' | 'info';
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    mostrarCancelar?: boolean;
    alConfirmar: () => void;
    alCancelar: () => void;
}