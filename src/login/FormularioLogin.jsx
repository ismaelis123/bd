import { useState } from "react";
import { supabase } from "../database/supabaseconfig";
import { useNavigate } from "react-router-dom";

const FormularioLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Credenciales incorrectas");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={iniciarSesion} className="login-card">
      <h2>Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary">Ingresar</button>
    </form>
  );
};

export default FormularioLogin;