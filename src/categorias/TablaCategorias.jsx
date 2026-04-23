import React from "react";
import { Row, Col, Card, Table, Button, Badge } from "react-bootstrap";

function TablaCategorias({ categorias, cargando, onEditar, onEliminar }) {

  if (cargando) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="d-none d-lg-block">
        <Table hover responsive className="shadow-sm rounded overflow-hidden">
          <thead style={{ background: "#1e293b", color: "#fff" }}>
            <tr>
              <th className="text-center" style={{ width: "80px" }}>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center">Estado</th>
              <th className="text-center" style={{ width: "140px" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td className="text-center fw-bold">{cat.id_categoria}</td>

                <td className="fw-semibold">{cat.nombre}</td>

                <td className="text-muted">
                  {cat.descripcion || "Sin descripción"}
                </td>

                <td className="text-center">
                  <Badge bg="success">Activa</Badge>
                </td>

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
            ))}
          </tbody>
        </Table>
      </div>

      {/* ================= MÓVIL ================= */}
      <div className="d-lg-none">
        <Row className="g-3">

          {categorias.map((cat) => (
            <Col xs={12} key={cat.id_categoria}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="d-flex align-items-center">

                  {/* ICONO */}
                  <div className="me-3 fs-3">📑</div>

                  {/* TEXTO */}
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">{cat.nombre}</h6>
                    <small className="text-muted">
                      {cat.descripcion || "Sin descripción"}
                    </small>
                  </div>

                  {/* DERECHA */}
                  <div className="text-end">
                    <Badge bg="success" className="mb-2">Activa</Badge>

                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => onEditar(cat)}
                      >
                        ✏️
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => onEliminar(cat)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          ))}

        </Row>
      </div>
    </>
  );
}

export default TablaCategorias;