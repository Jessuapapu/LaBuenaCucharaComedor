import { createBrowserRouter } from 'react-router-dom';

// Importas tus vistas (páginas)
<<<<<<< HEAD
import Indexs from '../pages/Index';
import Layout from '../pages/layout';
import { MenuMesas } from '../pages/menu';
=======
import { IndexMesero } from '../pages/IndexMesero';
import Layout from '../pages/layout';
import { MenuMesasMesero } from '../pages/Mesero/MenuMesero';
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559


// 1. Importas el Login y el Guardián
import Login from '../pages/Login'; // Ajusta la ruta a donde guardaste el componente
import { RutaProtegida } from './RutaProtegida'; // Ajusta la ruta
<<<<<<< HEAD
import { VistaClienteMesa } from '../pages/ordenesCliente';
import { InicioCliente } from '../pages/inicioCliente';
=======
import { VistaClienteMesa } from '../pages/Cliente/VistaOrdenesCliente';
import { InicioCliente } from '../pages/Cliente/inicioCliente';
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559

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
<<<<<<< HEAD
              element: <Indexs />
            },
            {
              path: "/mesa/:id",
              element: <MenuMesas />
=======
              element: <IndexMesero/>
            },
            {
              path: "/mesa/:id",
              element: <MenuMesasMesero />
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
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