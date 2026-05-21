import { useEffect, useState } from "react";
const UrlApi = import.meta.env.VITE_URL_API;



export function useImagenPlatillo( NombrePlatillo: string | null = null) {
  // 1. Definimos los estados que nuestro hook va a retornar
  const [Urlimagen, setImagen] = useState("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerImagen = async () => {
      try {
       
        const respuesta = await fetch(`${UrlApi}/imagenes/?NombrePlatillo=${NombrePlatillo}&NumeroImagen=1`);

        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        setImagen(data);

      } catch (err: any) {
        console.error("Error al obtener el menú:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerImagen();
  }, []);
  
  return { Urlimagen, cargando, error };
}