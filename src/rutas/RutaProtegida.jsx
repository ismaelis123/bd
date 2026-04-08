import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";

function RutaProtegida({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    // sesión actual
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUsuario(data.user);
      setCargando(false);
    };

    checkUser();

    // escuchar cambios (LOGIN / LOGOUT)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuario(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  if (cargando) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (!usuario) return <Navigate to="/login" replace />;

  return children;
}

export default RutaProtegida;