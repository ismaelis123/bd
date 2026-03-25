import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";

function RutaProtegida({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUsuario(data.user);
      setCargando(false);
    };

    getUser();
  }, []);

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutaProtegida;