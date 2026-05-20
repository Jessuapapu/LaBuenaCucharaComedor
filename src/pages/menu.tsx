import { useState } from "react";
import { useParams } from 'react-router-dom';
import { useMenu } from "../hooks/menu";
import { useEstado } from "../hooks/estadocomedor";
import { useOrdenesMesa, useDetalleOrden } from "../hooks/ordenes";

// Importamos el nuevo componente
import { ModalDetalleOrden } from "../Componentes/ordenes/ModalMostrarDetalles"; 

export function MenuMesas() {
    const estadoComedor = useEstado();
    const menu = useMenu();
    const { id } = useParams<{ id: string }>();
    
    const { ordenActiva, historial, cargando } = useOrdenesMesa(id);
    const { detallesOrden, cargandoDetalles, obtenerDetalle, limpiarDetalles } = useDetalleOrden();

    const [modalAbierto, setModalAbierto] = useState<boolean>(false);

    const manejarClicDetalle = async (idOrden: number) => {
        setModalAbierto(true);
        await obtenerDetalle(idOrden);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        limpiarDetalles();
    };

    const formatearFecha = (fechaIso: string | null): string => {
        if (!fechaIso) return "N/A";
        return new Date(fechaIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (estadoComedor.error != null || estadoComedor.estado?.status === false || menu.error != null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-4xl font-extrabold text-red-500 animate-pulse drop-shadow-md">
                    Comedor no abierto 
                </h1>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-gray-400 font-semibold animate-pulse text-lg">
                    Cargando información de la mesa...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                    Mesa <span className="text-blue-600">#{id}</span>
                </h1>
            </div>

            {/* SECCIÓN: ORDEN ACTIVA */}
            <div className="mb-10">
                <h2 className="text-lg font-bold mb-4 text-gray-500 uppercase tracking-wider">Orden Activa</h2>
                {ordenActiva ? (
                    <div 
                        onClick={() => manejarClicDetalle(ordenActiva.IdOrden)}
                        className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-2xl text-blue-900 group-hover:text-blue-600 transition-colors">
                                Pedido #{ordenActiva.IdOrden}
                            </span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                                En Curso
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Entrada: {formatearFecha(ordenActiva.HoraEntrada)}
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-100/50 border border-dashed border-gray-300 rounded-2xl p-8 text-center">
                        <p className="text-gray-400 font-medium">La mesa está libre actualmente.</p>
                    </div>
                )}
            </div>

            {/* SECCIÓN: HISTORIAL DE ÓRDENES */}
            <div>
                <h2 className="text-lg font-bold mb-4 text-gray-500 uppercase tracking-wider">Historial</h2>
                {historial.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {historial.map((orden) => (
                            <div 
                                key={orden.IdOrden} 
                                onClick={() => manejarClicDetalle(orden.IdOrden)}
                                className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-gray-700 group-hover:text-blue-500 transition-colors">
                                        Pedido #{orden.IdOrden}
                                    </h3>
                                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-semibold">
                                        Terminada
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-500">
                                    <p className="flex justify-between">
                                        <span>Entrada:</span> 
                                        <span className="font-medium text-gray-700">{formatearFecha(orden.HoraEntrada)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Salida:</span> 
                                        <span className="font-medium text-gray-700">{formatearFecha(orden.HoraSalida)}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">No hay registros de pedidos anteriores.</p>
                )}
            </div>

            {/* Invocación del componente Modal */}
            <ModalDetalleOrden 
                abierto={modalAbierto} 
                cargando={cargandoDetalles} 
                detalles={detallesOrden} 
                alCerrar={cerrarModal} 
            />

        </div>
    );
}

export default MenuMesas;