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
