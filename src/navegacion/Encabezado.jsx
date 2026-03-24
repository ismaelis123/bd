import { Link } from "react-router-dom";

function Encabezado() {

  const usuario = true; // simulación de sesión

  const cerrarSesion = () => {
    console.log("Sesión cerrada");
  };

  const mostrarMenu = usuario ? true : false;

  return (
    <nav>
      <h2>Mi Aplicación</h2>

      <Link to="/">Inicio</Link>

      {mostrarMenu ? (
        <>
          <Link to="/productos">Productos</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/catalogo">Catálogo</Link>
          <button onClick={cerrarSesion}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Encabezado;