import { useEffect, useState } from "react";

const UrlApi = import.meta.env.VITE_URL_API;

export function useMesas() {
  // 1. Definimos los estados que nuestro hook va a retornar
  const [numeroMesa, setnumeroMesa] = useState<[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerMesas = async () => {
      try {
        const respuesta = await fetch(`${UrlApi}/comedor/NumeroMesas`);

        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        setnumeroMesa(data);

      } catch (err: any) {
        console.error("Error al obtener el menú:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerMesas();
  }, []);
  
  return { numeroMesa,cargando, error };
}