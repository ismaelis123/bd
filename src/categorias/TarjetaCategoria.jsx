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
      {/* ====================== VISTA TABLA - ESCRITORIO ====================== */}
      <div className="d-none d-lg-block">
        <Table striped hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th className="text-center" style={{ width: "80px" }}>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center" style={{ width: "140px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id_categoria}>
                  <td className="text-center fw-bold">{cat.id_categoria}</td>
                  <td className="fw-semibold">{cat.nombre}</td>
                  <td>{cat.descripcion || "—"}</td>
                  <td className="text-center">
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      className="me-2"
                      onClick={() => onEditar(cat)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onEliminar(cat)}
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

      {/* ====================== VISTA TARJETAS - MÓVIL ====================== */}
      <div className="d-lg-none">
        <Row className="g-3">
          {categorias.length === 0 ? (
            <Col xs={12}>
              <div className="text-center py-5 text-muted">
                <h5>No hay categorías registradas aún</h5>
              </div>
            </Col>
          ) : (
            categorias.map((cat) => (
              <Col xs={12} key={cat.id_categoria}>
                <Card className="categoria-card border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center p-3">
                    
                    {/* Icono Bookmark */}
                    <div className="me-3">
                      <div className="bookmark-icon">📖</div>
                    </div>

                    {/* Información */}
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-semibold text-dark">{cat.nombre}</h5>
                      <p className="mb-0 text-muted small">
                        {cat.descripcion || "Sin descripción registrada."}
                      </p>
                    </div>

                    {/* Estado + Acciones */}
                    <div className="text-end d-flex flex-column align-items-end gap-2">
                      <span className="status-badge">Activa</span>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => onEditar(cat)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onEliminar(cat)}
                        >
                          🗑️
                        </Button>
                      </div>
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