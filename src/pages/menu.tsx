import { useState } from "react";
import { useParams } from 'react-router-dom';
import { useMenu } from "../hooks/menu";
import { useEstado } from "../hooks/estadocomedor";
import { useOrdenesMesa, useDetalleOrden } from "../hooks/ordenes";

export function MenuMesas() {
    const estadoComedor = useEstado();
    const menu = useMenu();
    
    // Tipamos useParams para decirle que esperamos un parámetro 'id' de tipo string
    const { id } = useParams<{ id: string }>();

    const { ordenActiva, historial, cargando } = useOrdenesMesa(id);
    const { detallesOrden, cargandoDetalles, obtenerDetalle, limpiarDetalles } = useDetalleOrden();
    
    const [modalAbierto, setModalAbierto] = useState<boolean>(false);

    // Tipamos el ID como number porque así lo espera nuestro backend y el hook
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-extrabold text-red-500 animate-pulse drop-shadow-md">
                    Comedor no abierto 😴
                </h1>
            </div>
        );
    }

    if (cargando) {
        return <div className="p-6 text-center text-gray-500 font-bold">Cargando datos de la mesa...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Mesa #{id}</h1>

            <h2 className="text-xl font-semibold mb-3 text-blue-600">Orden Activa</h2>
            {ordenActiva ? (
                <div 
                    onClick={() => manejarClicDetalle(ordenActiva.IdOrden)}
                    className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm mb-8 cursor-pointer hover:bg-blue-100 transition"
                >
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Orden #{ordenActiva.IdOrden}</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                            En Curso
                        </span>
                    </div>
                    <p className="text-gray-600 mt-2">Hora de entrada: {formatearFecha(ordenActiva.HoraEntrada)}</p>
                </div>
            ) : (
                <p className="text-gray-500 mb-8 italic">No hay órdenes activas en esta mesa.</p>
            )}

            <h2 className="text-xl font-semibold mb-3 text-gray-700">Historial (Terminadas)</h2>
            {historial.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {historial.map((orden) => (
                        <div 
                            key={orden.IdOrden} 
                            onClick={() => manejarClicDetalle(orden.IdOrden)}
                            className="bg-white border p-4 rounded shadow-sm cursor-pointer hover:shadow-md transition"
                        >
                            <h3 className="font-bold">Orden #{orden.IdOrden}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                                <p>Entrada: {formatearFecha(orden.HoraEntrada)}</p>
                                <p>Salida: {formatearFecha(orden.HoraSalida)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No hay historial para esta mesa.</p>
            )}

            {modalAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Detalle de la Orden</h3>
                            <button 
                                onClick={cerrarModal}
                                className="text-gray-500 hover:text-red-500 font-bold text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        {cargandoDetalles ? (
                            <p className="text-center text-gray-500 py-4 animate-pulse">Cargando platillos...</p>
                        ) : detallesOrden.length > 0 ? (
                            <div className="divide-y">
                                {detallesOrden.map((item, index) => (
                                    <div key={index} className="py-3 flex justify-between">
                                        <div>
                                            <p className="font-semibold">{item.nombre_platillo}</p>
                                            <p className="text-sm text-gray-500">Cant: {item.cantidad} x C${item.precio_unitario}</p>
                                        </div>
                                        <div className="font-bold text-gray-800">
                                            C${(item.cantidad * item.precio_unitario).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No se encontraron detalles.</p>
                        )}
                        
                        <button 
                            onClick={cerrarModal}
                            className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuMesas;