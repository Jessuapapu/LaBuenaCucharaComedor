import { useEffect, useState } from "react";
import type { Platillo, PlatilloExtraDB } from "../interfaces/comedor";
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

export function usePlatillosExtra(abierto: boolean) {
    const [platillosDb, setPlatillosDb] = useState<PlatilloExtraDB[]>([]);
    const [cargandoDb, setCargandoDb] = useState(false);

    useEffect(() => {
        // Optimización: Solo hace fetch si el modal se abre y no tenemos los datos aún
        if (abierto && platillosDb.length === 0) {
            const cargarPlatillos = async () => {
                setCargandoDb(true);
                try {
                    const token = localStorage.getItem("access_token");
                    
                    const respuesta = await fetch(`${UrlApi}/platillos/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            // Inyección de seguridad
                            ...(token ? { "Authorization": `Bearer ${token}` } : {})
                        }
                    });

                    // Protección contra sesión expirada
                    if (respuesta.status === 401) {
                        window.location.href = "/login";
                        throw new Error("Sesión expirada o inválida");
                    }

                    if (!respuesta.ok) throw new Error("Error en el servidor al cargar platillos");

                    const data: PlatilloExtraDB[] = await respuesta.json();
                    setPlatillosDb(data);

                } catch (error) {
                    console.error("Error cargando platillos extra:", error);
                } finally {
                    setCargandoDb(false);
                }
            };

            cargarPlatillos();
        }
    }, [abierto, platillosDb.length]);

    return { platillosDb, cargandoDb };
}