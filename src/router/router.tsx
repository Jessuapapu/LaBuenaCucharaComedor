import { createBrowserRouter } from 'react-router-dom';

// Importas tus vistas (páginas)
import { IndexMesero } from '../pages/IndexMesero';
import Layout from '../pages/layout';
import { MenuMesasMesero } from '../pages/Mesero/MenuMesero';


// 1. Importas el Login y el Guardián
import Login from '../pages/Login'; // Ajusta la ruta a donde guardaste el componente
import { RutaProtegida } from './RutaProtegida'; // Ajusta la ruta
import { VistaClienteMesa } from '../pages/Cliente/VistaOrdenesCliente';
import { InicioCliente } from '../pages/Cliente/inicioCliente';
import Caja from '../pages/Cajero/Caja';

export default function Routess() {
  return createBrowserRouter([
    {
      path: "/",
      element: <InicioCliente />
    },
    {
      element: <Layout />,
      children: [

        // ==========================================
        // RUTAS PÚBLICAS
        // ==========================================

        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/cuenta/:id",
          element: <VistaClienteMesa />

        },

        // ==========================================
        // RUTAS PROTEGIDAS (Requieren Token)
        // ==========================================
        {
          element: <RutaProtegida />,
          children: [
            {
              path: "/mesero",
              element: <IndexMesero/>
            },
            {
              path: "/mesa/:id",
              element: <MenuMesasMesero />
            },
            {
              path:'/cajero',
              element: <Caja />
            }
          ]
        },

        // ==========================================
        // RUTA 404 (Siempre al final)
        // ==========================================
        {
          path: "*",
          element: <div className="text-center p-10 font-bold text-xl">Error 404: Página no encontrada</div>
        }
      ]
    }
  ]);
}