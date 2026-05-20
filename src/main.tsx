import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import '../src/styles/indexs.css'
import './styles/botonMesa.css'
import Routess from './router/router.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
    <RouterProvider router={Routess()} />
  </React.StrictMode>
);

