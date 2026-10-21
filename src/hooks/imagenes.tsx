import { useEffect, useState } from "react";
const UrlApi = import.meta.env.VITE_URL_API;


function obtenerUrlImagen(data: unknown): string {
  const registro = Array.isArray(data) ? data[0] : data;
  const objeto = registro && typeof registro === "object" ? registro as Record<string, unknown> : null;
  const clavesUrl = ["Urlimagen", "urlImagen", "url_imagen", "url", "imageUrl", "image_url", "imagen", "data"];
  const valor = typeof registro === "string"
    ? registro
    : objeto
      ? clavesUrl.map((clave) => objeto[clave]).find((item) => typeof item === "string")
        ?? Object.values(objeto).find((item) => typeof item === "string")
      : null;

  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error("No se encontró una URL de imagen para este platillo.");
  }

  return valor.trim();
}

export function useImagenPlatillo(NombrePlatillo: string | null = null) {
  const [Urlimagen, setImagen] = useState("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controlador = new AbortController();

    const obtenerImagen = async () => {
      if (!NombrePlatillo?.trim()) {
        setImagen("");
        setError("Falta el nombre del platillo.");
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);
      setImagen("");

      try {
        const parametros = new URLSearchParams({ NombrePlatillo, NumeroImagen: "1" });
        const apiBase = UrlApi?.replace(/\/+$/, "");
        if (!apiBase) throw new Error("No está configurada la dirección del servidor de imágenes.");

        const respuesta = await fetch(`${apiBase}/imagenes/?${parametros.toString()}`, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const data: unknown = await respuesta.json();
        const url = obtenerUrlImagen(data);
        const urlImagen = /^(https?:|data:|blob:)/i.test(url)
          ? url
          : new URL(url, `${apiBase}/`).toString();
        if (!controlador.signal.aborted) setImagen(urlImagen);

      } catch (err) {
        if (controlador.signal.aborted) return;
        const mensaje = err instanceof Error ? err.message : "No se pudo cargar la foto del platillo.";
        console.error("Error al obtener la imagen del platillo:", err);
        setError(mensaje);
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    };

    obtenerImagen();
    return () => controlador.abort();
  }, [NombrePlatillo]);

  return { Urlimagen, cargando, error };
}
