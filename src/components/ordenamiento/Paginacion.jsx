import React from "react";
import { Pagination, Form, Row, Col } from "react-bootstrap";

const Paginacion = ({
  registrosPorPagina,
  totalRegistros,
  paginaActual,
  establecerPaginaActual,
  establecerRegistrosPorPagina,
}) => {
  const numerosPagina = [];
  for (let i = 1; i <= Math.ceil(totalRegistros / registrosPorPagina); i++) {
    numerosPagina.push(i);
  }

  return (
    <Row className="align-items-center mt-3 g-2">
      {/* Selector de cantidad a la izquierda */}
      <Col xs={12} md={4} className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
        <span className="small text-muted">Mostrar:</span>
        <Form.Select
          size="sm"
          style={{ width: "80px" }}
          value={registrosPorPagina}
          onChange={(e) => {
            establecerRegistrosPorPagina(Number(e.target.value));
            establecerPaginaActual(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Select>
        <span className="small text-muted text-nowrap">
          de {totalRegistros} registros
        </span>
      </Col>

      {/* NÚMEROS DE PÁGINA CENTRADOS */}
      <Col xs={12} md={4} className="d-flex justify-content-center">
        <Pagination size="sm" className="mb-0 shadow-sm">
          <Pagination.Prev
            disabled={paginaActual === 1}
            onClick={() => establecerPaginaActual(paginaActual - 1)}
          />
          {numerosPagina.map((numero) => (
            <Pagination.Item
              key={numero}
              active={numero === paginaActual}
              onClick={() => establecerPaginaActual(numero)}
            >
              {numero}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={paginaActual === numerosPagina.length}
            onClick={() => establecerPaginaActual(paginaActual + 1)}
          />
        </Pagination>
      </Col>

      {/* Espaciador para mantener el equilibrio visual en escritorio */}
      <Col md={4} className="d-none d-md-block"></Col>
    </Row>
  );
};

export default Paginacion;