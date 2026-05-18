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



