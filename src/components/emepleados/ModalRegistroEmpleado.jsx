import React, { useState } from "react";

import {
  Modal,
  Form,
  Button
} from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

const ModalRegistroEmpleado = ({
  show,
  onHide,
  fetchData
}) => {

  const [nuevo, setNuevo] =
    useState({
      nombre_empleado: "",
      apellido_empleado: "",
      celular: "",
      email: "",
      pin: "",
      tipo_empleado: "Empleado"
    });

  const guardar = async () => {

    // CREAR AUTH
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email: nuevo.email,
      password: nuevo.pin
    });

    if (error) {

      console.log(error);

      alert(error.message);

      return;
    }

    // INSERTAR TABLA
    const { error: errorEmpleado } =
      await supabase
        .from("empleados")
        .insert([
          {
            auth_id:
              data.user.id,

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

    if (errorEmpleado) {

      console.log(errorEmpleado);

      alert(errorEmpleado.message);

      return;
    }

    alert("Empleado creado");

    fetchData();

    onHide();

  };

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title>
          Nuevo empleado
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Control
          className="mb-3"
          placeholder="Nombre"
          onChange={(e) =>
            setNuevo({
              ...nuevo,
              nombre_empleado:
                e.target.value
            })
          }
        />

        <Form.Control
          className="mb-3"
          placeholder="Apellido"
          onChange={(e) =>
            setNuevo({
              ...nuevo,
              apellido_empleado:
                e.target.value
            })
          }
        />

        <Form.Control
          className="mb-3"
          placeholder="Celular"
          onChange={(e) =>
            setNuevo({
              ...nuevo,
              celular:
                e.target.value
            })
          }
        />

        <Form.Control
          className="mb-3"
          placeholder="Correo"
          type="email"
          onChange={(e) =>
            setNuevo({
              ...nuevo,
              email:
                e.target.value
            })
          }
        />

        <Form.Control
          className="mb-3"
          placeholder="Contraseña"
          type="password"
          onChange={(e) =>
            setNuevo({
              ...nuevo,
              pin:
                e.target.value
            })
          }
        />

      </Modal.Body>

      <Modal.Footer>

        <Button onClick={guardar}>
          Guardar
        </Button>

      </Modal.Footer>

    </Modal>

  );

};

export default ModalRegistroEmpleado;