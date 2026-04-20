import React from "react";
import { Row, Col, Card, Table, Spinner, Button } from "react-bootstrap";

function TablaCategorias({ categorias, cargando, onEditar, onEliminar }) {

  if (cargando) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <>
      {/* TABLA - Versión Escritorio */}
      <div className="d-none d-lg-block">
        <Table bordered hover responsive className="shadow-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th className="text-center" style={{ width: "80px" }}>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center" style={{ width: "160px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">No hay categorías registradas</td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id_categoria}>
                  <td className="text-center fw-bold">{cat.id_categoria}</td>
                  <td className="fw-semibold">{cat.nombre}</td>
                  <td>{cat.descripcion || "—"}</td>
                  <td className="text-center">
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2 px-3"
                      onClick={() => onEditar(cat)}
                      title="Editar"
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="px-3"
                      onClick={() => onEliminar(cat)}
                      title="Eliminar"
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* TARJETAS - Versión Móvil */}
      <div className="d-lg-none">
        <Row className="g-3">
          {categorias.length === 0 ? (
            <Col xs={12}>
              <div className="text-center py-5 text-muted">
                <h5>No hay categorías registradas</h5>
              </div>
            </Col>
          ) : (
            categorias.map((cat) => (
              <Col xs={12} key={cat.id_categoria}>
                <Card className="categoria-card shadow-sm border-0">
                  <Card.Body className="d-flex align-items-center p-3">
                    <div className="me-3">
                      <div className="bookmark-icon">📖</div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-semibold">{cat.nombre}</h5>
                      <p className="mb-0 text-muted small">{cat.descripcion || "Sin descripción"}</p>
                    </div>
                    <div className="d-flex gap-1">
                      <Button variant="warning" size="sm" onClick={() => onEditar(cat)}>
                        ✏️
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onEliminar(cat)}>
                        🗑️
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </>
  );
}

export default TablaCategorias;