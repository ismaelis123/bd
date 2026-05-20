import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const Encabezado = () => {

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const manejarToggle = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  // 🔥 CERRAR SESIÓN
  const cerrarSesion = async () => {

    try {

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      localStorage.removeItem("usuario-supabase");

      setMostrarMenu(false);

      navigate("/login");

    } catch (err) {

      console.error(
        "Error cerrando sesión:",
        err.message
      );

    }
  };

  // 🔥 RUTAS
  const esLogin = location.pathname === "/login";

  const esCatalogo =
    location.pathname === "/catalogo" &&
    localStorage.getItem("usuario-supabase") === null;

  // 🔥 MENÚ
  let contenidoMenu;

  // LOGIN
  if (esLogin) {

    contenidoMenu = (

      <Nav className="ms-auto pe-2">

        <Nav.Link
          onClick={() => manejarNavegacion("/login")}
          className={
            mostrarMenu
              ? "color-texto-marca"
              : "text-black"
          }
        >

          <i className="bi-person-fill-lock me-2"></i>

          Iniciar sesión

        </Nav.Link>

      </Nav>

    );

  }

  // CATÁLOGO PÚBLICO
  else if (esCatalogo) {

    contenidoMenu = (

      <Nav className="ms-auto pe-2">

        <Nav.Link
          onClick={() => manejarNavegacion("/catalogo")}
          className={
            mostrarMenu
              ? "color-texto-marca"
              : "text-black"
          }
        >

          <i className="bi-images me-2"></i>

          <strong>Catálogo</strong>

        </Nav.Link>

      </Nav>

    );

  }

  // ADMIN
  else {

    contenidoMenu = (
      <>

        <Nav className="ms-auto pe-2">

          {/* INICIO */}
          <Nav.Link
            onClick={() => manejarNavegacion("/")}
            className={
              mostrarMenu
                ? "color-texto-marca"
                : "text-black"
            }
          >

            {mostrarMenu &&
              <i className="bi-house-fill me-2"></i>
            }

            <strong>Inicio</strong>

          </Nav.Link>

          {/* CATEGORÍAS */}
          <Nav.Link
            onClick={() => manejarNavegacion("/categorias")}
            className={
              mostrarMenu
                ? "color-texto-marca"
                : "text-black"
            }
          >

            {mostrarMenu &&
              <i className="bi-bookmark-fill me-2"></i>
            }

            <strong>Categorías</strong>

          </Nav.Link>

          {/* PRODUCTOS */}
          <Nav.Link
            onClick={() => manejarNavegacion("/productos")}
            className={
              mostrarMenu
                ? "color-texto-marca"
                : "text-black"
            }
          >

            {mostrarMenu &&
              <i className="bi-bag-heart-fill me-2"></i>
            }

            <strong>Productos</strong>

          </Nav.Link>

          {/* EMPLEADOS */}
          <Nav.Link
            onClick={() => manejarNavegacion("/empleados")}
            className={
              mostrarMenu
                ? "color-texto-marca"
                : "text-black"
            }
          >

            {mostrarMenu &&
              <i className="bi-people-fill me-2"></i>
            }

            <strong>Empleados</strong>

          </Nav.Link>

          {/* CATÁLOGO */}
          <Nav.Link
            onClick={() => manejarNavegacion("/catalogo")}
            className={
              mostrarMenu
                ? "color-texto-marca"
                : "text-black"
            }
          >

            {mostrarMenu &&
              <i className="bi-images me-2"></i>
            }

            <strong>Catálogo</strong>

          </Nav.Link>

          <hr />

          {/* BOTÓN CERRAR EN NAVBAR */}
          {!mostrarMenu && (

            <Nav.Link
              onClick={cerrarSesion}
              className="text-black"
            >

              <i className="bi-box-arrow-right me-2"></i>

            </Nav.Link>

          )}

        </Nav>

        {/* INFO USUARIO */}
        {mostrarMenu && (

          <div className="mt-3 p-3 rounded bg-light text-dark">

            <p className="mb-2">

              <i className="bi-envelope-fill me-2"></i>

              {
                localStorage
                  .getItem("usuario-supabase")
                  ?.toLowerCase()
                || "Usuario"
              }

            </p>

            <button
              className="btn btn-outline-danger mt-3 w-100"
              onClick={cerrarSesion}
            >

              <i className="bi-box-arrow-right me-2"></i>

              Cerrar sesión

            </button>

          </div>

        )}

      </>
    );
  }

  return (

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
            manejarNavegacion(
              esCatalogo
                ? "/catalogo"
                : "/"
            )
          }
          className="text-black fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >

          <strong>

            <h4 className="mb-0">
              Ferretería Laredo Kit
            </h4>

          </strong>

        </Navbar.Brand>

        {/* BOTÓN MENU */}
        {!esLogin && (

          <Navbar.Toggle
            aria-controls="menu-offcanvas"
            onClick={manejarToggle}
          />

        )}

        {/* OFFCANVAS */}
        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >

          <Offcanvas.Header closeButton>

            <Offcanvas.Title>
              Menú Principal
            </Offcanvas.Title>

          </Offcanvas.Header>

          <Offcanvas.Body>

            {contenidoMenu}

          </Offcanvas.Body>

        </Navbar.Offcanvas>

      </Container>

    </Navbar>

  );
};

export default Encabezado;