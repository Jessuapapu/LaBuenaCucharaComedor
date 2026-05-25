import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import '../src/styles/indexs.css'
import './styles/botonMesa.css'
import Routess from './router/router.tsx'
import { AuthProvider } from './context/context'

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>

    <AuthProvider>
      
      {/* 2. El RouterProvider va por dentro */}
      <RouterProvider router={Routess()} />
      
    </AuthProvider>
    
  </React.StrictMode>
);

