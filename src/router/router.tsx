import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importas tus vistas (páginas)
import Indexs from '../pages/Index';
import { MenuMesas } from '../pages/menu';
// import MenuMesa from './pages/MenuMesa'; <-- Tu futura página

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: El mapa con todas las mesas */}
        <Route path="/" element={<Indexs />} />
        
        {/* Ruta dinámica: El ':id' es la variable que pasaste en el navigate */}
        <Route 
          path="/mesa/:id" 
          element={<MenuMesas />} 
        />
        
        <Route path="*" element={<h2>Error 404: Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}