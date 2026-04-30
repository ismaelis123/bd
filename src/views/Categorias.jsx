import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../categorias/ModalRegistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../categorias/TablaCategorias";
import TarjetaCategoria from "../categorias/TarjetaCategoria";
import ModalEdicionCategoria from "../categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

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
        <Col xs={9}>
            <h3 className="mb-0"><i className="bi bi-bookmark-plus-fill me-2"></i> Categorías</h3>
        </Col>
        <Col xs={3} className="text-end">
          <Button onClick={() => setMostrarModal(true)}><i className="bi bi-plus-lg"></i></Button>
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

      {/* NOTIFICACIÓN: Solo el componente Toast, sin textos feos afuera */}
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