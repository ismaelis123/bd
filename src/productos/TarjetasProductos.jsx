import React from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

const TarjetasProductos = ({ productos, categorias, abrirEdicion, eliminarProducto }) => {

  const obtenerCategoria = (id) => {
    const cat = categorias.find(c => c.id_categoria == id);
    return cat ? cat.nombre : "General";
  };

  return (
    <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-2">

      {productos.map(p => (
        <Col key={p.id_producto}>

          <Card className="shadow-sm border-0 h-100">

            <div className="d-flex align-items-center p-2">

              {/* 🖼️ IMAGEN PEQUEÑA */}
              <img
                src={p.url_imagen || "https://via.placeholder.com/80"}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginRight: "10px"
                }}
              />

              {/* 📄 INFO */}
              <div className="flex-grow-1">

                <div className="fw-bold text-truncate">{p.nombre}</div>

                <small className="text-muted">
                  {obtenerCategoria(p.categoria_id)}
                </small>

                <div className="text-success fw-bold">
                  C$ {Number(p.precio).toFixed(2)}
                </div>

                <small>Stock: {p.stock}</small>

              </div>

              {/* ⚙️ ACCIONES */}
              <div className="d-flex flex-column gap-1">

                <Button size="sm" variant="outline-primary"
                  onClick={() => abrirEdicion(p)}>
                  ✏️
                </Button>

                <Button size="sm" variant="outline-danger"
                  onClick={() => eliminarProducto(p.id_producto, p.url_imagen)}>
                  🗑️
                </Button>

              </div>

            </div>

          </Card>

        </Col>
      ))}

    </Row>
  );
};

export default TarjetasProductos;