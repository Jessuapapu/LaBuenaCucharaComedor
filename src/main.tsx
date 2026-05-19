import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Indexs from './pages/Index.tsx'

createRoot(document.getElementById('root')!).render(
  <Indexs />
)
