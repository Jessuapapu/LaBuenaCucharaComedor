import { useNavigate } from 'react-router-dom';
import '../../styles/botonMesa.css';



export function BotonMesa( id : number) {
  const navigate = useNavigate();

  const manejarClick = () => {
    // Redirige a la página deseada pasando el ID en la URL. 
    // Asegúrate de tener esta ruta configurada en tu App.tsx (ej: <Route path="/mesa/:id" />)
    navigate(`/mesa/${id}`); 
  };

  return (
    <button className="boton-mesa-wrapper" onClick={manejarClick} title={`Ir a la mesa ${id}`}>
      {/* Sillas alrededor */}
      <div className="silla silla-arriba"></div>
      <div className="silla silla-abajo"></div>
      <div className="silla silla-izquierda"></div>
      <div className="silla silla-derecha"></div>
      
      {/* La mesa central */}
      <div className="mesa-centro">
        <span>#{id}</span>
      </div>
    </button>
  );
}