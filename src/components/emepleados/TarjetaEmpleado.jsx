// ==========================================
// 📁 src/components/empleados/TarjetaEmpleado.jsx
// ==========================================

import React from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";

const TarjetaEmpleado = ({
  empleados,
  abrirModalEdicion,
  eliminarEmpleado
}) => {

  return (

    <Row className="g-3">

      {empleados.map(emp => (

        <Col xs={12} key={emp.id_empleado}>

          <Card className="shadow-sm border-0">

            <Card.Body>

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <h6 className="fw-bold mb-1">

                    {emp.nombre_empleado}
                    {" "}
                    {emp.apellido_empleado}

                  </h6>

                  <small className="text-muted d-block">
                    {emp.email}
                  </small>

                  <small className="text-muted d-block">
                    {emp.celular}
                  </small>

                </div>

                <Badge bg={
                  emp.tipo_empleado === "Administrador"
                    ? "danger"
                    : "primary"
                }>
                  {emp.tipo_empleado}
                </Badge>

              </div>

              <div className="d-flex gap-2 mt-3">

                <Button
                  size="sm"
                  variant="outline-primary"
                  className="flex-fill"
                  onClick={() => abrirModalEdicion(emp)}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  className="flex-fill"
                  onClick={() =>
                    eliminarEmpleado(
                      emp.id_empleado,
                      emp.nombre_empleado
                    )
                  }
                >
                  Eliminar
                </Button>

              </div>

            </Card.Body>

          </Card>

        </Col>

      ))}

    </Row>

  );
};

export default TarjetaEmpleado;