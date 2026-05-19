import { WebSocketComedor } from '../config/socket'
import type { ComedorOrdenIN, Detalles } from "../../interfaces/comedor"
import { useEstado } from '../hooks/estadocomedor'
import { useMesas } from '../hooks/mesas'

import { BotonMesa } from '../Componentes/mesa/mesaComponent'

// 1. La función de envío ahora es una función normal, sin hooks.
export const EnviarOrden = (IdMesas: number, Detalless: Detalles[]) => {
  const ComedorOrden: ComedorOrdenIN = {
    IdMesa: IdMesas,
    Detalles: Detalless
  }
  WebSocketComedor.emit("crear_orden", ComedorOrden)
}

export function Indexs() {
  const estadoComedor = useEstado()
  const { numeroMesa } = useMesas() 

  if (estadoComedor.error != null || estadoComedor.estado?.status === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-extrabold text-red-500 animate-pulse drop-shadow-md">
          Comedor no abierto 😴
        </h1>
      </div>
    )
  }
  
  const listaBotones = []
  
  for(let i = 0; i < numeroMesa.length; i++){
    listaBotones.push(<BotonMesa key={i} id={i + 1} />)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight drop-shadow-sm">
          Mapa del Comedor
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Seleccione una mesa para tomar la orden</p>
      </header>


      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        
      {listaBotones}
        
      </main>
    </div>
  )
}

export default Indexs;