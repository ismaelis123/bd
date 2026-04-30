import React from "react";
import { Form, InputGroup, Row, Col } from "react-bootstrap";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda }) => {
  return (
    <Row className="mb-3">
      <Col xs={12} sm={8} md={6} lg={4}> {/* Controla el ancho en diferentes pantallas */}
        <InputGroup size="sm shadow-sm">
          <InputGroup.Text className="bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            className="border-start-0 ps-0"
            type="text"
            placeholder="Buscar categoría..."
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
          />
        </InputGroup>
      </Col>
    </Row>
  );
};

export default CuadroBusquedas;