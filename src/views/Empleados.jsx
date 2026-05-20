import React, { useEffect, useState } from "react";

import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {

  const [empleados, setEmpleados] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");

  const [tipoNotificacion, setTipoNotificacion] = useState("exito");

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_empleado: "",
    apellido_empleado: "",
    email: "",
    celular: "",
    pin: "",
    tipo_empleado: "Empleado",
  });

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // OBTENER
  const obtenerEmpleados = async () => {

    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .order("id_empleado", {
        ascending: false,
      });

    if (!error) {
      setEmpleados(data || []);
    }
  };

  // TOAST
  const mostrarToast = (
    mensaje,
    tipo = "exito"
  ) => {

    setMensajeNotificacion(mensaje);

    setTipoNotificacion(tipo);

    setMostrarNotificacion(true);
  };

  // INPUTS
  const manejarCambio = (e) => {

    const { name, value } = e.target;

    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: value,
    });
  };

  // REGISTRAR
  const registrarEmpleado = async () => {

    const { error } = await supabase
      .from("empleados")
      .insert([nuevoEmpleado]);

    if (error) {

      mostrarToast(
        error.message,
        "error"
      );

      return;
    }

    mostrarToast(
      "Empleado registrado",
      "exito"
    );

    obtenerEmpleados();

    cerrarModal();
  };

  // EDITAR
  const editarEmpleado = async () => {

    const { error } = await supabase
      .from("empleados")
      .update({
        nombre_empleado:
          nuevoEmpleado.nombre_empleado,

        apellido_empleado:
          nuevoEmpleado.apellido_empleado,

        email: nuevoEmpleado.email,

        celular: nuevoEmpleado.celular,

        pin: nuevoEmpleado.pin,

        tipo_empleado:
          nuevoEmpleado.tipo_empleado,
      })
      .eq(
        "id_empleado",
        empleadoSeleccionado.id_empleado
      );

    if (error) {

      mostrarToast(
        error.message,
        "error"
      );

      return;
    }

    mostrarToast(
      "Empleado actualizado",
      "exito"
    );

    obtenerEmpleados();

    cerrarModal();
  };

  // ELIMINAR
  const eliminarEmpleado = async (id) => {

    const confirmar = confirm(
      "¿Eliminar empleado?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("empleados")
      .delete()
      .eq("id_empleado", id);

    if (error) {

      mostrarToast(
        error.message,
        "error"
      );

      return;
    }

    mostrarToast(
      "Empleado eliminado",
      "exito"
    );

    obtenerEmpleados();
  };

  // ABRIR EDICIÓN
  const abrirEdicion = (empleado) => {

    setModoEdicion(true);

    setEmpleadoSeleccionado(empleado);

    setNuevoEmpleado({
      nombre_empleado:
        empleado.nombre_empleado,

      apellido_empleado:
        empleado.apellido_empleado,

      email: empleado.email,

      celular: empleado.celular,

      pin: empleado.pin,

      tipo_empleado:
        empleado.tipo_empleado,
    });

    setMostrarModal(true);
  };

  // CERRAR
  const cerrarModal = () => {

    setMostrarModal(false);

    setModoEdicion(false);

    setEmpleadoSeleccionado(null);

    setNuevoEmpleado({
      nombre_empleado: "",
      apellido_empleado: "",
      email: "",
      celular: "",
      pin: "",
      tipo_empleado: "Empleado",
    });
  };

  // COLOR ROL
  const colorCargo = (cargo) => {

    switch (cargo) {

      case "Administrador":
        return "danger";

      case "Vendedor":
        return "warning";

      default:
        return "primary";
    }
  };

  return (

    <Container className="mt-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>

          <h3 className="fw-bold mb-0">
            Empleados
          </h3>

          <small className="text-muted">
            Gestión de empleados
          </small>

        </div>

        <Button
          onClick={() =>
            setMostrarModal(true)
          }
        >
          + Nuevo
        </Button>

      </div>

      {/* TABLA */}
      <Card className="shadow-sm border-0">

        <div className="table-responsive">

          <Table
            hover
            className="align-middle mb-0"
          >

            <thead className="table-light">

              <tr>

                <th>ID</th>

                <th>Nombre</th>

                <th>Email</th>

                <th>Celular</th>

                <th>Rol</th>

                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {empleados.map((emp) => (

                <tr key={emp.id_empleado}>

                  <td>
                    #{emp.id_empleado}
                  </td>

                  <td className="fw-semibold">

                    {emp.nombre_empleado}
                    {" "}
                    {emp.apellido_empleado}

                  </td>

                  <td>
                    {emp.email}
                  </td>

                  <td>
                    {emp.celular}
                  </td>

                  <td>

                    <Badge
                      bg={colorCargo(
                        emp.tipo_empleado
                      )}
                    >
                      {emp.tipo_empleado}
                    </Badge>

                  </td>

                  <td>

                    <div className="d-flex gap-2">

                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          abrirEdicion(emp)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                          eliminarEmpleado(
                            emp.id_empleado
                          )
                        }
                      >
                        Eliminar
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

        </div>

      </Card>

      {/* MODAL */}
      <Modal
        show={mostrarModal}
        onHide={cerrarModal}
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>

            {modoEdicion
              ? "Editar empleado"
              : "Nuevo empleado"}

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
                    name="nombre_empleado"
                    value={nuevoEmpleado.nombre_empleado}
                    onChange={manejarCambio}
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
                    name="apellido_empleado"
                    value={nuevoEmpleado.apellido_empleado}
                    onChange={manejarCambio}
                  />

                </Form.Group>

              </Col>

            </Row>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={nuevoEmpleado.email}
                    onChange={manejarCambio}
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Celular
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="celular"
                    value={nuevoEmpleado.celular}
                    onChange={manejarCambio}
                  />

                </Form.Group>

              </Col>

            </Row>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    PIN / Contraseña
                  </Form.Label>

                  <Form.Control
                    type="password"
                    name="pin"
                    value={nuevoEmpleado.pin}
                    onChange={manejarCambio}
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Tipo de empleado
                  </Form.Label>

                  <Form.Select
                    name="tipo_empleado"
                    value={nuevoEmpleado.tipo_empleado}
                    onChange={manejarCambio}
                  >

                    <option value="Administrador">
                      Administrador
                    </option>

                    <option value="Vendedor">
                      Vendedor
                    </option>

                    <option value="Empleado">
                      Empleado
                    </option>

                  </Form.Select>

                </Form.Group>

              </Col>

            </Row>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={cerrarModal}
          >
            Cancelar
          </Button>

          <Button
            onClick={
              modoEdicion
                ? editarEmpleado
                : registrarEmpleado
            }
          >

            {modoEdicion
              ? "Actualizar"
              : "Guardar"}

          </Button>

        </Modal.Footer>

      </Modal>

      {/* TOAST */}
      <NotificacionOperacion
        mostrar={mostrarNotificacion}
        mensaje={mensajeNotificacion}
        tipo={tipoNotificacion}
        onCerrar={() =>
          setMostrarNotificacion(false)
        }
      />

    </Container>
  );
};

export default Empleados;