export interface ComedorOrden{
    NombreCliente: string;
    Detalles: OrdenDetalles[]
}

export interface OrdenDetalles {
    nombre_platillo: string;
    cantidad: number;
}

export interface mesa{
    id_mesa: number;
    Estado: boolean;
}



