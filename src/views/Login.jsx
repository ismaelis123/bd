import React, { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";
import FormularioLogin from "../login/FormularioLogin";
import { Navigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

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

  // Pantalla de carga estilizada con un Spinner de Bootstrap centrado
  if (cargando) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center bg-light" 
        style={{ height: "100vh", width: "100vw" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status" className="mb-2" />
          <p className="text-secondary fw-medium">Validando credenciales...</p>
        </div>
      </div>
    );
  }

  if (sesion) return <Navigate to="/" />;

  return (
    <div 
      className="d-flex justify-content-center align-items-center p-3"
      style={{ 
        height: "100vh", 
        width: "100vw", 
        background: "linear-gradient(135deg, #0d6efd 0%, #0a4ebd 100%)" 
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            {/* Tarjeta de Login Estilizada */}
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white animate__animated animate__fadeIn">
              <Card.Body className="p-4 p-sm-5">
                
                {/* Encabezado / Logo */}
                <div className="text-center mb-4">
                  <div 
                    className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
                    style={{ width: "64px", height: "64px" }}
                  >
                    {/* Ícono de candado/seguridad en SVG nativo */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915V9.5a.5.5 0 0 1-1 0V7.915A1.5 1.5 0 0 1 8 5"/>
                    </svg>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">¡Bienvenido de nuevo!</h3>
                  <p className="text-muted small">Ingresa tus datos para acceder al sistema</p>
                </div>

                {/* Formulario de Login */}
                <div className="mt-2">
                  <FormularioLogin setSesion={setSesion} />
                </div>

                {/* Pie de la tarjeta (Opcional/Estético) */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                    © {new Date().getFullYear()} Sistema de Gestión Comercial
                  </p>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;