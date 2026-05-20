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

