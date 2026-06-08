import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../categorias/ModalRegistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../categorias/TablaCategorias";
import TarjetaCategoria from "../categorias/TarjetaCategoria";
import ModalEdicionCategoria from "../categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import ModalEnvioCorreoCategorias from "../categorias/ModalEnvioCorreoCategorias";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  
  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre: "",
    descripcion: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(10);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al cargar categorías.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // --- NUEVA FUNCIÓN: COPIAR CATEGORÍA AL PORTAPAPELES CORREGIDA ---
  const copiarCategoria = async (categoria) => {
    if (!categoria) return;

    // Adaptado a tus columnas reales: 'nombre' y 'descripcion'
    const texto = `ID: ${categoria.id_categoria}\nCategoría: ${categoria.nombre}\nDescripción: ${categoria.descripcion || 'Sin descripción'}`;

    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Categoría "${categoria.nombre}" copiada al portapapeles.`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al copiar:", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar al portapapeles",
        tipo: "error",
      });
    }
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });
    setMostrarModalEdicion(true);
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre.trim()) {
        setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
        return;
      }
      const { error } = await supabase.from("categorias").insert([nuevaCategoria]);
      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Categoría registrada.", tipo: "exito" });
      setNuevaCategoria({ nombre: "", descripcion: "" });
      setMostrarModal(false);
      await cargarCategorias();
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al registrar.", tipo: "error" });
    }
  };

  const actualizarCategoria = async () => {
    try {
      if (!categoriaEditar.nombre.trim()) {
        setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
        return;
      }
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre: categoriaEditar.nombre,
          descripcion: categoriaEditar.descripcion,
        })
        .eq("id_categoria", categoriaEditar.id_categoria);

      if (error) throw error;
      setMostrarModalEdicion(false);
      await cargarCategorias();
      setToast({ mostrar: true, mensaje: "Categoría actualizada.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  const eliminarCategoria = async () => {
    try {
      if (!categoriaAEliminar) return;
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoriaAEliminar.id_categoria);

      if (error) throw error;
      setMostrarModalEliminacion(false);
      await cargarCategorias();
      setToast({ mostrar: true, mensaje: "Categoría eliminada.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    }
  };

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";
    let texto = `LISTADO DE CATEGORÍAS\n\n`;
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de categorías: ${categorias.length}\n\n`;
    
    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre}\n`;
      if (cat.descripcion) {
        texto += `   Descripción: ${cat.descripcion}\n`;
      }
      texto += `\n`;
    });
    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }
    
    setEnviandoCorreo(true);
    const mensaje = formatearCategoriasParaCorreo();
    
    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )
    .then(() => {
      setToast({
        mostrar: true,
        mensaje: "Correo enviado correctamente.",
        tipo: "exito",
      });
      setMostrarModalCorreo(false);
      setEmailDestino("");
    })
    .catch((error) => {
      console.error("Error EmailJS:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al enviar el correo.",
        tipo: "error",
      });
    })
    .finally(() => {
      setEnviandoCorreo(false);
    });
  };

  useEffect(() => { cargarCategorias(); }, []);

  useEffect(() => {
    const filtradas = categorias.filter(
      (cat) =>
        cat.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        cat.descripcion?.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    setCategoriasFiltradas(filtradas);
  }, [textoBusqueda, categorias]);

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-bookmark-plus-fill me-2"></i> Categorías
          </h3>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
          <Button variant="primary" onClick={abrirModalCorreo} size="md">
            <i className="bi bi-envelope"></i>
            <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
          </Button>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-lg-inline ms-2">Nueva Categoría</span>
          </Button>
        </Col>
      </Row>
      <hr />
      
      <CuadroBusquedas 
        textoBusqueda={textoBusqueda} 
        manejarCambioBusqueda={(e) => { setTextoBusqueda(e.target.value); establecerPaginaActual(1); }} 
      />

      {cargando ? (
        <div className="text-center my-5"><Spinner animation="border" variant="success" /></div>
      ) : (
        <Row>
          {/* MÓVIL (Se pasa el prop copiarCategoria) */}
          <Col xs={12} className="d-lg-none">
            <TarjetaCategoria 
              categorias={categoriasPaginadas} 
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={(cat) => { setCategoriaAEliminar(cat); setMostrarModalEliminacion(true); }}
              copiarCategoria={copiarCategoria}
            />
          </Col>
          {/* ESCRITORIO (Se pasa el prop copiarCategoria) */}
          <Col lg={12} className="d-none d-lg-block">
            <TablaCategorias 
              categorias={categoriasPaginadas} 
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={(cat) => { setCategoriaAEliminar(cat); setMostrarModalEliminacion(true); }}
              copiarCategoria={copiarCategoria}
            />
          </Col>
        </Row>
      )}

      {categoriasFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={categoriasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <ModalRegistroCategoria 
        mostrarModal={mostrarModal} 
        setMostrarModal={setMostrarModal} 
        nuevaCategoria={nuevaCategoria} 
        manejoCambioInput={(e) => setNuevaCategoria({...nuevaCategoria, [e.target.name]: e.target.value})} 
        agregarCategoria={agregarCategoria} 
      />

      <ModalEdicionCategoria 
        mostrarModalEdicion={mostrarModalEdicion} 
        setMostrarModalEdicion={setMostrarModalEdicion} 
        categoriaEditar={categoriaEditar} 
        manejoCambioInputEdicion={(e) => setCategoriaEditar({...categoriaEditar, [e.target.name]: e.target.value})} 
        actualizarCategoria={actualizarCategoria} 
      />

      <ModalEliminacionCategoria 
        mostrarModalEliminacion={mostrarModalEliminacion} 
        setMostrarModalEliminacion={setMostrarModalEliminacion} 
        eliminarCategoria={eliminarCategoria} 
        categoria={categoriaAEliminar} 
      />

      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      <NotificacionOperacion 
        mostrar={toast.mostrar} 
        mensaje={toast.mensaje} 
        tipo={toast.tipo} 
        onCerrar={() => setToast({ ...toast, mostrar: false })} 
      />
    </Container>
  );
};

export default Categorias;