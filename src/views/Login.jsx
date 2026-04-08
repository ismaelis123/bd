import { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";
import FormularioLogin from "../login/FormularioLogin";
import { Navigate } from "react-router-dom";

function Login() {

  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setSesion(data.session);
      setCargando(false);
    };

    check();
  }, []);

  if (cargando) return <p>Cargando...</p>;

  if (sesion) return <Navigate to="/" />;

  return (
    <div className="login-container">
      <FormularioLogin setSesion={setSesion} />
    </div>
  );
}

export default Login;