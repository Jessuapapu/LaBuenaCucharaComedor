import { useEffect, useState } from 'react'
import { WebSocketComedor } from './config/socket'
import type { ComedorOrdenIN, Detalles } from "../interfaces/comedor"
import './App.css'
const UrlApi = import.meta.env.VITE_URL_API;

// Interfaz para el menú que viene de tu API
interface PlatilloMenu {
  id: number;
  Fecha: string;
  NombrePlatillo: string;
  PrecioSimulado?: number; // Fallback para tu Pydantic obligatoria
}

export function App() {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(null);
  const [menu, setMenu] = useState<PlatilloMenu[]>([]);
  const [carrito, setCarrito] = useState<Detalles[]>([]);
  const [cargandoMenu, setCargandoMenu] = useState<boolean>(false);
  const [estadoPedido, setEstadoPedido] = useState<'idle' | 'enviando' | 'exito' | 'error'>('idle');

  // Listado de mesas disponibles (Basado en tus 7 mesas activas de la BD)
  const MESAS = [1, 2, 3, 4, 5, 6, 7];

  // Cargar el menú del día desde el backend
  useEffect(() => {
    if (mesaSeleccionada === null) return;

    const consultarMenuHoy = async () => {
      setCargandoMenu(true);
      try {
        const respuesta = await fetch(UrlApi + '/menu/hoy');
        const datos = await respuesta.json();
        
        // Mapeamos los platillos asignando un precio base si el endpoint no lo incluye
        const datosConPrecio = datos.map((platillo: any) => ({
          ...platillo,
          PrecioSimulado: platillo.PrecioUnico || 120 // C$ 120 por defecto si no viene de la BD
        }));
        
        setMenu(datosConPrecio);
      } catch (error) {
        console.error("Error al obtener el menú del día:", error);
      } finally {
        setCargandoMenu(false);
      }
    };

    consultarMenuHoy();
  }, [mesaSeleccionada]);

  // Escuchar confirmación de la orden vía Sockets
  useEffect(() => {
    const onExito = (respuesta: any) => {
      console.log("Orden procesada:", respuesta);
      setEstadoPedido('exito');
      setCarrito([]);
      setTimeout(() => {
        setEstadoPedido('idle');
        setMesaSeleccionada(null); // Regresa al index de mesas automáticamente
      }, 2500);
    };

    const onError = (error: any) => {
      console.error(error);
      setEstadoPedido('error');
      setTimeout(() => setEstadoPedido('idle'), 4000);
    };

    WebSocketComedor.on("orden_generada", onExito);
    WebSocketComedor.on("error_generar", onError);

    return () => {
      WebSocketComedor.off("orden_generada", onExito);
      WebSocketComedor.off("error_generar", onError);
    };
  }, []);

  const agregarAlCarrito = (nombre: string, precio: number) => {
    setCarrito((prev) => {
      const existe = prev.find(item => item.nombre_platillo === nombre);
      if (existe) {
        return prev.map(item => 
          item.nombre_platillo === nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { nombre_platillo: nombre, cantidad: 1, precio_unitario: precio }];
    });
  };

  const quitarDelCarrito = (nombre: string) => {
    setCarrito((prev) => {
      const existe = prev.find(item => item.nombre_platillo === nombre);
      if (existe && existe.cantidad > 1) {
        return prev.map(item => 
          item.nombre_platillo === nombre ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
      return prev.filter(item => item.nombre_platillo !== nombre);
    });
  };

  const enviarOrden = () => {
    if (carrito.length === 0 || mesaSeleccionada === null) return;
    setEstadoPedido('enviando');

    const payload: ComedorOrdenIN = {
      IdMesa: mesaSeleccionada,
      Detalles: carrito
    };

    WebSocketComedor.emit("crear_orden", payload);
  };

  const total = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario!), 0);

  // --- VISTA 1: INDEX DE SELECCIÓN DE MESAS ---
  if (mesaSeleccionada === null) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>🥄 La Buena Cuchara</h1>
          <p>Selecciona tu mesa para comenzar tu pedido</p>
        </header>
        <main className="mesas-grid">
          {MESAS.map((idMesa) => (
            <div key={idMesa} className="card-mesa" onClick={() => setMesaSeleccionada(idMesa)}>
              <span className="mesa-numero">#{idMesa}</span>
              <p>Mesa Disponible</p>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // --- VISTA 2: MENÚ DEL DÍA Y CARRITO ---
  return (
    <div className="app-container">
      <header className="header-menu">
        <button className="btn-volver" onClick={() => { setMesaSeleccionada(null); setCarrito([]); }}>
          ← Cambiar de Mesa
        </button>
        <h2>Mesa Seleccionada: #{mesaSeleccionada}</h2>
        <p>Menú del Día</p>
      </header>

      <main className="main-content">
        {/* Sección del catálogo */}
        <section className="menu-grid">
          {cargandoMenu ? (
            <p className="loading">Cargando los platillos de hoy...</p>
          ) : menu.length === 0 ? (
            <p className="loading">No hay platillos registrados para hoy.</p>
          ) : (
            menu.map((platillo) => (
              <div key={platillo.id} className="card-platillo">
                <div className="platillo-icono">🍲</div>
                <h3>{platillo.NombrePlatillo}</h3>
                <p className="precio">C$ {platillo.PrecioSimulado}</p>
                <button className="btn-agregar" onClick={() => agregarAlCarrito(platillo.NombrePlatillo, platillo.PrecioSimulado!)}>
                  Agregar
                </button>
              </div>
            ))
          )}
        </section>

        {/* Sidebar de la Orden */}
        <aside className="carrito-sidebar">
          <h2>Tu Pedido</h2>
          <div className="lista-carrito">
            {carrito.length === 0 ? (
              <p className="carrito-vacio">Aún no agregas platillos</p>
            ) : (
              carrito.map((item, index) => (
                <div key={index} className="item-carrito">
                  <div className="item-info">
                    <span className="item-nombre">{item.nombre_platillo}</span>
                    <span className="item-precio">C$ {item.precio_unitario}</span>
                  </div>
                  <div className="item-controles">
                    <button onClick={() => quitarDelCarrito(item.nombre_platillo)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item.nombre_platillo, item.precio_unitario!)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="resumen-orden">
            <div className="total">
              <span>Total:</span>
              <span>C$ {total}</span>
            </div>
            <button 
              className={`btn-confirmar ${carrito.length === 0 ? 'disabled' : ''}`}
              onClick={enviarOrden}
              disabled={carrito.length === 0 || estadoPedido === 'enviando'}
            >
              {estadoPedido === 'enviando' ? 'Enviando a Cocina...' : 'Enviar Orden'}
            </button>
            {estadoPedido === 'exito' && <p className="msg-exito">¡Orden enviada con éxito! 🧑‍🍳</p>}
            {estadoPedido === 'error' && <p className="msg-error">Error al procesar la orden.</p>}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;