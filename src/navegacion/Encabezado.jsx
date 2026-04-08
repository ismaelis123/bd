import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";

function Encabezado() {

  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="navbar">

      <h2>Mi App</h2>

      {/* BOTÓN HAMBURGUESA */}
      <div className={`hamburger ${menuAbierto ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* MENÚ */}
      <nav className={`nav-menu ${menuAbierto ? "open" : ""}`}>

        <Link to="/" onClick={cerrarMenu}>Inicio</Link>
        <Link to="/categorias" onClick={cerrarMenu}>Categorías</Link>
        <Link to="/productos" onClick={cerrarMenu}>Productos</Link>
        <Link to="/catalogo" onClick={cerrarMenu}>Catálogo</Link>

        <button className="btn logout" onClick={cerrarSesion}>
          Salir
        </button>

      </nav>

    </header>
  );
}

export default Encabezado;