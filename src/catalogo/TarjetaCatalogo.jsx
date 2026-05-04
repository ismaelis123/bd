import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <>
      <Card style={{ width: "18rem", margin: "10px" }}>
        <Card.Img
          variant="top"
          src={producto.url_imagen || "https://via.placeholder.com/200"}
          style={{ height: "200px", objectFit: "cover" }}
        />

        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>
            {producto.descripcion?.substring(0, 80)}...
          </Card.Text>
          <Button onClick={abrirModal}>Ver más</Button>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{producto.nombre}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img
            src={producto.url_imagen || "https://via.placeholder.com/300"}
            className="img-fluid mb-3"
          />
          <p>{producto.descripcion}</p>
          <h5>C$ {producto.precio}</h5>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={cerrarModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;