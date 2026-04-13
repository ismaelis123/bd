import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";

function TablaCategorias({ categorias, cargando, onEditar, onEliminar }) {

  if (cargando) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="shadow-sm border rounded-3 overflow-hidden bg-white">
      <Table 
        striped 
        hover 
        responsive 
        className="mb-0 align-middle"
      >
        <thead className="table-dark">
          <tr>
            <th style={{ width: "100px" }} className="text-center">ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th style={{ width: "220px" }} className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-5 text-muted">
                <h5>No hay categorías registradas</h5>
                <p>¡Agrega la primera usando el botón de arriba!</p>
              </td>
            </tr>
          ) : (
            categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td className="text-center fw-bold">{cat.id_categoria}</td>
                <td className="fw-semibold">{cat.nombre}</td>
                <td>{cat.descripcion || <span className="text-muted">— Sin descripción —</span>}</td>
                <td className="text-center">
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => onEditar(cat)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onEliminar(cat)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default TablaCategorias;