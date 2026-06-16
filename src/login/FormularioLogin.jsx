import React, { useState } from "react";
import { Form, Button, Alert, FloatingLabel } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Recibimos setSesion desde el padre para cambiar el estado global en caliente
const FormularioLogin = ({ setSesion }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [autenticando, setAutenticando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setAutenticando(true); // Congela los inputs para evitar doble clic

    try {
      // Tu lógica real de LOGIN NORMAL con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Si todo sale bien, guardamos la sesión. El padre se encarga de redirigir a "/"
      if (data?.session && setSesion) {
        setSesion(data.session);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Credenciales incorrectas. Revisá bien el correo o la contraseña, mae.");
    } finally {
      setAutenticando(false);
    }
  };

  return (
    <Form onSubmit={iniciarSesion}>
      {/* Alerta de Error estilizada sin molestos alerts del navegador */}
      {errorMsg && (
        <Alert variant="danger" className="py-2 px-3 small border-0 text-center rounded-3 mb-3">
          {errorMsg}
        </Alert>
      )}

      {/* Input de Correo con Label Flotante Dinámico */}
      <FloatingLabel controlId="floatingInput" label="Correo electrónico" className="mb-3 text-secondary">
        <Form.Control
          type="email"
          placeholder="nombre@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-light-subtle rounded-3"
          style={{ fontSize: "15px", boxShadow: "none" }}
          disabled={autenticando}
        />
      </FloatingLabel>

      {/* Input de Contraseña con Label Flotante Dinámico */}
      <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-4 text-secondary">
        <Form.Control
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-light-subtle rounded-3"
          style={{ fontSize: "15px", boxShadow: "none" }}
          disabled={autenticando}
        />
      </FloatingLabel>

      {/* Botón Estilizado con Gradiente y Feedback de Carga */}
      <Button 
        variant="primary" 
        type="submit" 
        className="w-100 py-2.5 fw-semibold rounded-3 text-uppercase"
        style={{ 
          fontSize: "14px", 
          letterSpacing: "0.5px",
          background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
          border: "none",
          transition: "all 0.2s ease"
        }}
        disabled={autenticando}
      >
        {autenticando ? "Validando..." : "Ingresar"}
      </Button>
    </Form>
  );
};

export default FormularioLogin;