import { useEffect, useState } from "react";
import type { estadoComedor } from "../interfaces/comedor";
const UrlApi = import.meta.env.VITE_URL_API;



export function useEstado() {
  // 1. Definimos los estados que nuestro hook va a retornar
  const [estado, setestado] = useState<estadoComedor>({msj: "inactivo", status: false});
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerestado = async () => {
      try {
        const respuesta = await fetch(`${UrlApi}/comedor/NumeroMesas`);
        
        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        console.log(data)
        setestado(data);

      } catch (err: any) {
        console.error("Error al obtener el menú:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerestado();
  }, []);

  return { estado, cargando, error };
}