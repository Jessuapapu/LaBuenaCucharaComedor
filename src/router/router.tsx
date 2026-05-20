import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from "react-dom/client";
// Importas tus vistas (páginas)
import Indexs from '../pages/Index';
import Layout from '../pages/layout';
import { MenuMesas } from '../pages/menu';


export default function Routess(){

  return createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/", element: <Indexs />
        },
        {
          path: "/mesa/:id", element: <MenuMesas />
        },
        {
          path: "*", element: <h2>Error 404: Página no encontrada</h2>
        }
      ]
    }
  ]);
}