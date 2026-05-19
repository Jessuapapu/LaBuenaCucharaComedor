import { useEffect, useState } from 'react'
import { WebSocketComedor } from '../config/socket'
import type { ComedorOrdenIN, Detalles, } from "../../interfaces/comedor"
import { useMenu } from '../hooks/menu'
import { useEstado } from '../hooks/estadocomedor'
import { useMesas } from '../hooks/mesas'

import { BotonMesa } from '../Componentes/mesa/mesaComponent'


async function EnviarOrden(IdMesas: number, Detalless: Detalles[]) {
  const ComedorOrden: ComedorOrdenIN = {
    IdMesa: IdMesas,
    Detalles: Detalless
  }
  useEffect(() => {
    WebSocketComedor.emit("crear_orden", ComedorOrden)

  })
}


export function indexs() {
  const [NumeroMesas, setNumeroMesa] = useState<number>(0)
  const estadoComedor = useEstado()
  if (estadoComedor.error != null || estadoComedor.estado.status == false) {
    return <>
      <h1>
        Comedor no abierto :)
      </h1>
    </>
  }
  

  setNumeroMesa(useMesas().numeroMesa)
  return <>

  
  </>
}

export default indexs;