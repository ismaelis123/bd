import React, { useState } from "react";

import {
  Modal,
  Form,
  Button,
  Row,
  Col
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalRegistroEmpleado = ({
  show,
  onHide,
  fetchData,
  mostrarNotificacion
}) => {

  const [loading, setLoading] =
    useState(false);

  const [nuevo, setNuevo] = useState({
    nombre_empleado: "",
    apellido_empleado: "",
    celular: "",
    email: "",
    pin: "",
    tipo_empleado: "empleado"
  });

  // LIMPIAR
  const limpiarFormulario = () => {

    setNuevo({
      nombre_empleado: "",
      apellido_empleado: "",
      celular: "",
      email: "",
      pin: "",
      tipo_empleado: "empleado"
    });

  };

  // GUARDAR
  const handleGuardar = async () => {

    try {

      setLoading(true);

      // VALIDAR
      if (
        !nuevo.nombre_empleado ||
        !nuevo.apellido_empleado ||
        !nuevo.email ||
        !nuevo.pin
      ) {

        mostrarNotificacion(
          "Complete todos los campos",
          "advertencia"
        );

        return;
      }

      // CREAR USUARIO EN AUTH
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email: nuevo.email.trim(),
        password: nuevo.pin.trim()
      });

      console.log(authData);
      console.log(authError);

      // ERROR AUTH
      if (authError) {

        mostrarNotificacion(
          authError.message,
          "error"
        );

        return;
      }

      // INSERTAR EMPLEADO
      const { error } = await supabase
        .from("empleados")
        .insert([
          {
            auth_id:
              authData.user.id,

            nombre_empleado:
              nuevo.nombre_empleado,

            apellido_empleado:
              nuevo.apellido_empleado,

            celular:
              nuevo.celular,

            email:
              nuevo.email,

            pin:
              nuevo.pin,

            tipo_empleado:
              nuevo.tipo_empleado
          }
        ]);

      // ERROR INSERT
      if (error) {

        mostrarNotificacion(
          error.message,
          "error"
        );

        return;
      }

      mostrarNotificacion(
        "Empleado registrado correctamente",
        "exito"
      );

      limpiarFormulario();

      fetchData();

      onHide();

    } catch (error) {

      console.log(error);

      mostrarNotificacion(
        "Error inesperado",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Nuevo Empleado
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <Form>

          <Row>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Nombre
                </Form.Label>

                <Form.Control
                  type="text"
                  value={
                    nuevo.nombre_empleado
                  }
                  onChange={(e) =>
                    setNuevo({
                      ...nuevo,
                      nombre_empleado:
                        e.target.value
                    })
                  }
                />

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Apellido
                </Form.Label>

                <Form.Control
                  type="text"
                  value={
                    nuevo.apellido_empleado
                  }
                  onChange={(e) =>
                    setNuevo({
                      ...nuevo,
                      apellido_empleado:
                        e.target.value
                    })
                  }
                />

              </Form.Group>

            </Col>

          </Row>

          <Form.Group className="mb-3">

            <Form.Label>
              Celular
            </Form.Label>

            <Form.Control
              type="text"
              value={nuevo.celular}
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  celular: e.target.value
                })
              }
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Correo
            </Form.Label>

            <Form.Control
              type="email"
              value={nuevo.email}
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  email: e.target.value
                })
              }
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Contraseña
            </Form.Label>

            <Form.Control
              type="password"
              value={nuevo.pin}
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  pin: e.target.value
                })
              }
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Cargo
            </Form.Label>

            <Form.Select
              value={
                nuevo.tipo_empleado
              }
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  tipo_empleado:
                    e.target.value
                })
              }
            >

              <option value="empleado">
                Empleado
              </option>

              <option value="vendedor">
                Vendedor
              </option>

              <option value="administrador">
                Administrador
              </option>

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

        <Button
          onClick={handleGuardar}
          disabled={loading}
        >

          {loading
            ? "Guardando..."
            : "Guardar"}

        </Button>

      </Modal.Footer>

    </Modal>

  );
};

export default ModalRegistroEmpleado;