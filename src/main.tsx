import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../src/styles/indexs.css'
import './styles/botonMesa.css'
import Router from './router/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
  
)
