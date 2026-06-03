import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser"; // [cite: 63]
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
import ModalEnvioCorreoCategorias from "../categorias/ModalEnvioCorreoCategorias"; // [cite: 62]

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  // --- ESTADO CORREGIDO: Usando 'nombre' y 'descripcion' ---
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

  // --- NUEVOS ESTADOS PARA EMAILJS ---
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false); // [cite: 65]
  const [emailDestino, setEmailDestino] = useState(""); // [cite: 66]
  const [enviandoCorreo, setEnviandoCorreo] = useState(false); // [cite: 67]

  // --- INICIALIZAR EMAILJS ---
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY); // [cite: 71]
  }, []); // [cite: 72]

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

  // --- NUEVAS FUNCIONES PARA EL MANEJO DE CORREOS ---
  const abrirModalCorreo = () => {
    setEmailDestino(""); // [cite: 74]
    setMostrarModalCorreo(true); // [cite: 75]
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas."; // [cite: 78]
    let texto = `LISTADO DE CATEGORÍAS\n\n`; // [cite: 79]
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`; // [cite: 80]
    texto += `Total de categorías: ${categorias.length}\n\n`; // [cite: 81]
    
    categorias.forEach((cat, index) => {
      // ADAPTADO: Usamos 'cat.nombre' y 'cat.descripcion' correspondientes a tu base de datos
      texto += `${index + 1}. ${cat.nombre}\n`; 
      if (cat.descripcion) { 
        texto += `   Descripción: ${cat.descripcion}\n`; 
      }
      texto += `\n`; // [cite: 87]
    });
    return texto; // [cite: 89]
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) { // [cite: 92]
      setToast({ // [cite: 93]
        mostrar: true, // [cite: 94]
        mensaje: "Por favor ingresa un correo destino.", // [cite: 95]
        tipo: "advertencia", // [cite: 96]
      });
      return; // [cite: 98]
    }
    
    setEnviandoCorreo(true); // [cite: 100]
    const mensaje = formatearCategoriasParaCorreo(); // [cite: 101]
    
    const templateParams = { // [cite: 102]
      to_name: "Administrador", // [cite: 103]
      user_email: emailDestino, // [cite: 104]
      message: mensaje, // [cite: 105]
      fecha_envio: new Date().toLocaleDateString("es-NI") // [cite: 106]
    };

    emailjs.send( // [cite: 108]
      import.meta.env.VITE_EMAILJS_SERVICE_ID, // [cite: 109]
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // [cite: 110]
      templateParams // [cite: 111]
    )
    .then(() => { // [cite: 113]
      setToast({ // [cite: 114]
        mostrar: true, // [cite: 115]
        mensaje: "Correo enviado correctamente.", // [cite: 116]
        tipo: "exito", // [cite: 117]
      });
      setMostrarModalCorreo(false); // [cite: 119]
      setEmailDestino(""); // [cite: 120]
    })
    .catch((error) => { // [cite: 122]
      console.error("Error EmailJS:", error); // [cite: 123]
      setToast({ // [cite: 124]
        mostrar: true, // [cite: 125]
        mensaje: "Error al enviar el correo.", // [cite: 126]
        tipo: "error", // [cite: 127]
      });
    })
    .finally(() => { // [cite: 130]
      setEnviandoCorreo(false); // [cite: 131]
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
      {/* SECCIÓN REESTRUCTURADA CON EL NUEVO BOTÓN DE CORREO */}
      <Row className="align-items-center mb-3"> {/* [cite: 135] */}
        <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center"> {/* [cite: 136] */}
          <h3 className="mb-0">
            <i className="bi bi-bookmark-plus-fill me-2"></i> Categorías {/* [cite: 138] */}
          </h3>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end"> {/* [cite: 141] */}
          <Button variant="primary" onClick={abrirModalCorreo} size="md"> {/* [cite: 142] */}
            <i className="bi bi-envelope"></i> {/* [cite: 143] */}
            <span className="d-none d-lg-inline ms-2">Enviar por Correo</span> {/*  */}
          </Button>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} className="text-end"> {/* [cite: 147] */}
          <Button onClick={() => setMostrarModal(true)} size="md"> {/* [cite: 148, 151] */}
            <i className="bi bi-plus-lg"></i> {/* [cite: 152] */}
            <span className="d-none d-lg-inline ms-2">Nueva Categoría</span> {/*  */}
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
          {/* MÓVIL */}
          <Col xs={12} className="d-lg-none">
            <TarjetaCategoria 
              categorias={categoriasPaginadas} 
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={(cat) => { setCategoriaAEliminar(cat); setMostrarModalEliminacion(true); }}
            />
          </Col>
          {/* ESCRITORIO */}
          <Col lg={12} className="d-none d-lg-block">
            <TablaCategorias 
              categorias={categoriasPaginadas} 
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={(cat) => { setCategoriaAEliminar(cat); setMostrarModalEliminacion(true); }}
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

      {/* COMPONENTE MODAL DE ENVÍO DE CORREO ADICIONADO */}
      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      {/* NOTIFICACIÓN */}
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