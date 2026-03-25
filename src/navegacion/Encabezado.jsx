import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";

function Encabezado() {

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {

    // 🔥 FORZAR CIERRE DE SESIÓN AL INICIAR (para pruebas)
    const cerrar = async () => {
      await supabase.auth.signOut();
    };

    cerrar();

    // 🔥 ESCUCHAR CAMBIOS DE LOGIN
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuario(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <h2>Mi Aplicación 🚀</h2>

      <div>
        <Link to="/">Inicio</Link>

        {usuario ? (
          <>
            <Link to="/productos">Productos</Link>
            <Link to="/categorias">Categorías</Link>
            <Link to="/catalogo">Catálogo</Link>

            <button className="btn" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Encabezado;