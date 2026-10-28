import type { MesaBackend, OrdenCocina, DetalleOrden } from "../interfaces/Cocina";


const API_URL = import.meta.env.VITE_URL_API;

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const cocinaService = {
  obtenerOrdenesActivas: async (): Promise<OrdenCocina[]> => {
    const resMesas = await fetch(`${API_URL}/comedor/`, {
      method: "GET",
      headers: getHeaders()
    });
    
    if (!resMesas.ok) throw new Error("Error al obtener mesas");
    
    const dataMesas = await resMesas.json();
    const mesas: MesaBackend[] = dataMesas.Mesas || [];

    const ordenesActivas = mesas
      .filter(m => m.Ordenes.some(o => o.Activo === true))
      .map(m => {
        const orden = m.Ordenes.find(o => o.Activo === true)!;
        return { IdMesa: m.Id, Orden: orden };
      });

    const ordenesCompletas = await Promise.all(
      ordenesActivas.map(async (item) => {
        const resDetalle = await fetch(`${API_URL}/comedor/detalle/${item.Orden.IdOrden}`, {
          method: "GET",
          headers: getHeaders()
        });
        
        let detalles: DetalleOrden[] = [];
        if (resDetalle.ok) {
          detalles = await resDetalle.json();
        }

        return {
          IdMesa: item.IdMesa,
          IdOrden: item.Orden.IdOrden,
          HoraEntrada: item.Orden.HoraEntrada,
          Mesero: item.Orden.Mesero || "Desconocido",
          Detalles: detalles
        } as OrdenCocina;
      })
    );

    return ordenesCompletas;
  }
};