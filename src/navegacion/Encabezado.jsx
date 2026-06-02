import React, { useState } from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  Button
} from "react-bootstrap";

import ChatIA from "../components/ia/ChatIA";

import { supabase }
from "../database/supabaseconfig";

const Encabezado = () => {

  const [mostrarMenu,
    setMostrarMenu] =
    useState(false);

  // CHAT IA
  const [mostrarChatIA,
    setMostrarChatIA] =
    useState(false);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const manejarToggle = () => {

    setMostrarMenu(
      !mostrarMenu
    );

  };

  const manejarNavegacion = (
    ruta
  ) => {

    navigate(ruta);

    setMostrarMenu(false);

  };

  // CERRAR SESIÓN
  const cerrarSesion =
    async () => {

    try {

      await supabase.auth.signOut();

      localStorage.removeItem(
        "usuario-supabase"
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

    }

  };

  const esLogin =
    location.pathname ===
    "/login";

  return (

    <>

      <Navbar
        expand="md"
        fixed="top"
        className="color-navbar shadow-lg"
        variant="dark"
      >

        <Container>

          {/* LOGO */}
          <Navbar.Brand
            onClick={() =>
              manejarNavegacion("/")
            }
            className="text-black fw-bold"
            style={{
              cursor: "pointer"
            }}
          >

            Ferretería Laredo Kit

          </Navbar.Brand>

          {/* BOTÓN MENU */}
          {!esLogin && (

            <Navbar.Toggle
              aria-controls="menu-offcanvas"
              onClick={
                manejarToggle
              }
            />

          )}

          {/* MENU */}
          <Navbar.Offcanvas
            id="menu-offcanvas"
            placement="end"
            show={mostrarMenu}
            onHide={() =>
              setMostrarMenu(false)
            }
          >

            <Offcanvas.Header closeButton>

              <Offcanvas.Title>

                Menú Principal

              </Offcanvas.Title>

            </Offcanvas.Header>

            <Offcanvas.Body>

              <Nav className="ms-auto pe-2">

                {/* INICIO */}
                <Nav.Link
                  onClick={() =>
                    manejarNavegacion("/")
                  }
                >
                  Inicio
                </Nav.Link>

                {/* CATEGORÍAS */}
                <Nav.Link
                  onClick={() =>
                    manejarNavegacion(
                      "/categorias"
                    )
                  }
                >
                  Categorías
                </Nav.Link>

                {/* PRODUCTOS */}
                <Nav.Link
                  onClick={() =>
                    manejarNavegacion(
                      "/productos"
                    )
                  }
                >
                  Productos
                </Nav.Link>

                {/* EMPLEADOS */}
                <Nav.Link
                  onClick={() =>
                    manejarNavegacion(
                      "/empleados"
                    )
                  }
                >
                  Empleados
                </Nav.Link>

                {/* CATÁLOGO */}
                <Nav.Link
                  onClick={() =>
                    manejarNavegacion(
                      "/catalogo"
                    )
                  }
                >
                  Catálogo
                </Nav.Link>

                {/* IA */}
                <Button
                  className="mt-3"
                  onClick={() =>
                    setMostrarChatIA(
                      true
                    )
                  }
                >

                  IA

                </Button>

                {/* CERRAR */}
                <Button
                  variant="danger"
                  className="mt-3"
                  onClick={
                    cerrarSesion
                  }
                >

                  Cerrar sesión

                </Button>

              </Nav>

            </Offcanvas.Body>

          </Navbar.Offcanvas>

        </Container>

      </Navbar>

      {/* CHAT IA */}
      <ChatIA
        mostrar={mostrarChatIA}
        onCerrar={() =>
          setMostrarChatIA(false)
        }
      />

    </>

  );

};

export default Encabezado;