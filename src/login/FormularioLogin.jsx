import { useState } from "react";
import { supabase } from "../database/supabaseconfig";

const FormularioLogin = ({ setSesion }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Error al iniciar sesión");
    } else {
      setSesion(data.user);
    }
  };

  return (
    <form onSubmit={iniciarSesion} className="card">
      <h2>Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button className="btn">Ingresar</button>
    </form>
  );
};

export default FormularioLogin;