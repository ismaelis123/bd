import { useEffect, useState } from "react";
import FormularioLogin from "../login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";

function Login() {

  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSesion(data.session);
    };

    getSession();
  }, []);

  return (
    <div className="container">
      <h1>Login</h1>

      {!sesion ? (
        <FormularioLogin setSesion={setSesion} />
      ) : (
        <p>Ya estás logueado ✅</p>
      )}
    </div>
  );
}

export default Login;