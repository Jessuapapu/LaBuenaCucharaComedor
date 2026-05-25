import { createBrowserRouter } from 'react-router-dom';

// Importas tus vistas (páginas)
import Indexs from '../pages/Index';
import Layout from '../pages/layout';
import { MenuMesas } from '../pages/menu';

// 1. Importas el Login y el Guardián
import Login from '../comunes/Login'; // Ajusta la ruta a donde guardaste el componente
import { RutaProtegida } from '../comunes/RutaProtegida'; // Ajusta la ruta

export default function Routess() {
  return createBrowserRouter([
    {
      element: <Layout />,
      children: [
        // ==========================================
        // RUTAS PÚBLICAS
        // ==========================================
        {
          path: "/", 
          element: <Indexs />
        },
        {
          path: "/login", 
          element: <Login />
        },
        
        // ==========================================
        // RUTAS PROTEGIDAS (Requieren Token)
        // ==========================================
        {
          // El guardián intercepta aquí. Si no hay token, 
          // rebota al usuario a /login antes de leer los children.
          element: <RutaProtegida />, 
          children: [
            {
              path: "/mesa/:id", 
              element: <MenuMesas />
            },
            // Aquí puedes seguir agregando más rutas operativas
            // { path: "/mesero/mapa", element: <MapaMesas /> }
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