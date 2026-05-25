import { useEffect, useState } from "react";
import type { Platillo } from "../interfaces/comedor";
const UrlApi =  import.meta.env.VITE_URL_API;



export function useMenu() {
  // 1. Definimos los estados que nuestro hook va a retornar
  const [menu, setMenu] = useState<Platillo[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
        const respuesta = await fetch(`${UrlApi}/menu/hoy`);

        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        setMenu(data);

      } catch (err: any) {
        console.error("Error al obtener el menú:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerMenu();
  }, []);

  return { menu, cargando, error };
}