// ==========================================
// 📁 src/components/empleados/ModalEdicionEmpleado.jsx
// ==========================================

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  show,
  onHide,
  empleado,
  actualizarEmpleado
}) => {

  const [editado, setEditado] = useState({});

  useEffect(() => {

    if (empleado) {
      setEditado(empleado);
    }

  }, [empleado]);

  const handleActualizar = async () => {

    await actualizarEmpleado(editado);

  };

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Editar Empleado
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <Form>

          <Row>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>Nombre</Form.Label>

                <Form.Control
                  value={editado.nombre_empleado || ""}
                  onChange={(e) =>
                    setEditado({
                      ...editado,
                      nombre_empleado: e.target.value
                    })
                  }
                />

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>Apellido</Form.Label>

                <Form.Control
                  value={editado.apellido_empleado || ""}
                  onChange={(e) =>
                    setEditado({
                      ...editado,
                      apellido_empleado: e.target.value
                    })
                  }
                />

              </Form.Group>

            </Col>

          </Row>

          <Form.Group className="mb-3">

            <Form.Label>Celular</Form.Label>

            <Form.Control
              value={editado.celular || ""}
              onChange={(e) =>
                setEditado({
                  ...editado,
                  celular: e.target.value
                })
              }
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              value={editado.email || ""}
              onChange={(e) =>
                setEditado({
                  ...editado,
                  email: e.target.value
                })
              }
            />

          </Form.Group>

          <Form.Group>

            <Form.Label>Tipo</Form.Label>

            <Form.Select
              value={editado.tipo_empleado || ""}
              onChange={(e) =>
                setEditado({
                  ...editado,
                  tipo_empleado: e.target.value
                })
              }
            >

              <option>Empleado</option>
              <option>Administrador</option>

            </Form.Select>

          </Form.Group>

        </Form>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancelar
        </Button>

        <Button onClick={handleActualizar}>
          Actualizar
        </Button>

      </Modal.Footer>

    </Modal>

  );
};

export default ModalEdicionEmpleado;