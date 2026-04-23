import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../categorias/ModalEliminacionCategoria";
import TablaCategorias from "../categorias/TablaCategorias";

import CuadroBusquedas from "../busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);

  const cargarCategorias = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("id_categoria", { ascending: true });

    if (!error) setCategorias(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
    cat.descripcion?.toLowerCase().includes(textoBusqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(categoriasFiltradas.length / registrosPorPagina);

  const inicio = (paginaActual - 1) * registrosPorPagina;
  const categoriasPaginadas = categoriasFiltradas.slice(
    inicio,
    inicio + registrosPorPagina
  );

  return (
    <Container className="mt-4">
      <Row>
        <Col>

          <div className="d-flex justify-content-between mb-3">
            <h2>📚 Categorías</h2>
            <Button onClick={() => setMostrarModalRegistro(true)}>
              + Nueva
            </Button>
          </div>

          {/* 🔍 BUSCADOR */}
          <CuadroBusquedas 
            texto={textoBusqueda} 
            onChange={setTextoBusqueda} 
          />

          {/* 📊 TABLA */}
          <TablaCategorias
            categorias={categoriasPaginadas}
            cargando={cargando}
            onEditar={(cat) => {
              setCategoriaEditar(cat);
              setMostrarModalEdicion(true);
            }}
            onEliminar={(cat) => {
              setCategoriaEliminar(cat);
              setMostrarModalEliminacion(true);
            }}
          />

          {/* 📄 PAGINACIÓN */}
          <div className="d-flex justify-content-center mt-4">
            <Paginacion
              totalPaginas={totalPaginas}
              paginaActual={paginaActual}
              setPaginaActual={setPaginaActual}
            />
          </div>

        </Col>
      </Row>

      <ModalRegistroCategoria
        mostrar={mostrarModalRegistro}
        onCerrar={() => setMostrarModalRegistro(false)}
        onGuardado={cargarCategorias}
      />

      <ModalEdicionCategoria
        mostrar={mostrarModalEdicion}
        onCerrar={() => setMostrarModalEdicion(false)}
        categoria={categoriaEditar}
        onGuardado={cargarCategorias}
      />

      <ModalEliminacionCategoria
        mostrar={mostrarModalEliminacion}
        onCerrar={() => setMostrarModalEliminacion(false)}
        categoria={categoriaEliminar}
        onEliminado={cargarCategorias}
      />
    </Container>
  );
}

export default Categorias;