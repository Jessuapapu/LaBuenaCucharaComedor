import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import '../src/styles/indexs.css'
import './styles/botonMesa.css'
import Routess from './router/router.tsx'
import { AuthProvider } from './Auth/context.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>

    <AuthProvider>

      <RouterProvider router={Routess()} />
      
    </AuthProvider>
    
  </React.StrictMode>
);
