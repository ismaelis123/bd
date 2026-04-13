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

  // Estados para los modales
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
      alert("Error al cargar categorías: " + error.message);
    } else {
      setCategorias(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Abrir modales
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
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h1 className="display-6 fw-bold text-primary mb-0">
              🛠️ Gestión de Categorías
            </h1>
            
            <Button 
              variant="success" 
              size="lg"
              className="shadow-sm"
              onClick={() => setMostrarModalRegistro(true)}
            >
              + Nueva Categoría
            </Button>
          </div>

          <hr className="mb-4" />

          <TablaCategorias 
            categorias={categorias} 
            cargando={cargando}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        </Col>
      </Row>

      {/* ==================== MODALES ==================== */}

      {/* Modal Registro */}
      <ModalRegistroCategoria
        mostrar={mostrarModalRegistro}
        onCerrar={() => setMostrarModalRegistro(false)}
        onGuardado={cargarCategorias}
      />

      {/* Modal Edición */}
      <ModalEdicionCategoria
        mostrar={mostrarModalEdicion}
        onCerrar={() => setMostrarModalEdicion(false)}
        categoria={categoriaEditar}
        onGuardado={cargarCategorias}
      />

      {/* Modal Eliminación */}
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