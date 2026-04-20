import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";

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
    <div className="login-card">
      <h2>Iniciar Sesión</h2>

      <form onSubmit={iniciarSesion}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default FormularioLogin;