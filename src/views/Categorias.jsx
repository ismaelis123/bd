import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../categorias/ModalEliminacionCategoria";
import TablaCategorias from "../categorias/TablaCategorias";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para modales
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

    if (error) {
      console.error("Error al cargar categorías:", error);
      alert("Error al cargar: " + error.message);
    } else {
      setCategorias(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleEditar = (cat) => {
    setCategoriaEditar(cat);
    setMostrarModalEdicion(true);
  };

  const handleEliminar = (cat) => {
    setCategoriaEliminar(cat);
    setMostrarModalEliminacion(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          {/* Header estilo Discosa */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="fs-3">📚</span>
              <h1 className="display-6 fw-bold mb-0 text-dark">Categorías</h1>
            </div>
            
            <Button 
              variant="primary" 
              size="lg"
              className="rounded-pill px-4"
              onClick={() => setMostrarModalRegistro(true)}
            >
              + Nueva
            </Button>
          </div>

          <hr className="mb-4" />

          {/* Lista de Categorías */}
          <TablaCategorias 
            categorias={categorias} 
            cargando={cargando}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        </Col>
      </Row>

      {/* Modales */}
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