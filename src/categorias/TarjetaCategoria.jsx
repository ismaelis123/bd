import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";

const TarjetaCategoria = ({ categorias, abrirModalEdicion, abrirModalEliminacion }) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  return (
    <div className="d-flex flex-column gap-2">
      {categorias.map((categoria) => {
        const esActiva = idTarjetaActiva === categoria.id_categoria;

        return (
          <Card
            key={categoria.id_categoria}
            className="border-0 shadow-sm position-relative overflow-hidden"
            onClick={() => setIdTarjetaActiva(esActiva ? null : categoria.id_categoria)}
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  {/* Ícono de etiqueta que pediste */}
                  <div className="bg-light p-2 rounded">
                    <i className="bi bi-bookmark text-secondary fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-0">{categoria.nombre}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '180px' }}>
                      {categoria.descripcion || "Sin descripción"}
                    </div>
                  </div>
                </div>

                {/* Texto "Activa" que salía antes */}
                <div className="text-end">
                  <span className="small fw-semibold text-dark">Activa</span>
                </div>
              </div>

              {/* Capa de acciones (Editar/Eliminar) al tocar */}
              {esActiva && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="d-flex gap-4 p-2 bg-white rounded-pill shadow-sm border">
                    <Button
                      variant="warning"
                      size="sm"
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => { abrirModalEdicion(categoria); setIdTarjetaActiva(null); }}
                    >
                      <i className="bi bi-pencil-fill text-white"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => { abrirModalEliminacion(categoria); setIdTarjetaActiva(null); }}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default TarjetaCategoria;