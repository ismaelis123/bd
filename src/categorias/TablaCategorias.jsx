import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaCategorias = ({ categorias, abrirModalEdicion, abrirModalEliminacion }) => {
  return (
    <div className="table-responsive">
      {/* Reducimos el padding general con un estilo CSS inline para máxima compactación */}
      <Table striped hover borderless size="sm" className="align-middle mt-1 custom-table-compact">
        <thead>
          <tr className="border-bottom" style={{ fontSize: '0.85rem' }}>
            <th className="py-2 fw-bold text-dark ps-3" style={{ width: '50px' }}>ID</th>
            <th className="py-2 fw-bold text-dark">Nombre Categoría</th>
            <th className="py-2 fw-bold text-dark">Descripción</th>
            <th className="py-2 fw-bold text-dark text-end pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id_categoria} style={{ fontSize: '0.85rem' }}>
              <td className="py-1 ps-3 text-dark">{cat.id_categoria}</td>
              <td className="py-1 text-dark fw-normal">{cat.nombre}</td>
              <td className="py-1 text-muted fw-normal text-truncate" style={{ maxWidth: '300px' }}>
                {cat.descripcion || '---'}
              </td>
              <td className="py-1 text-end pe-3">
                {/* Botones más pequeños y pegados */}
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  className="me-1 bg-white border-warning-subtle shadow-sm" 
                  style={{ padding: '1px 6px', borderRadius: '4px' }}
                  onClick={() => abrirModalEdicion(cat)}
                >
                  <i className="bi bi-pencil" style={{ fontSize: '0.8rem' }}></i>
                </Button>
                
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="bg-white border-danger-subtle shadow-sm"
                  style={{ padding: '1px 6px', borderRadius: '4px' }}
                  onClick={() => abrirModalEliminacion(cat)}
                >
                  <i className="bi bi-trash" style={{ fontSize: '0.8rem' }}></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-table-compact td, .custom-table-compact th {
          padding-top: 0.3rem !important;
          padding-bottom: 0.3rem !important;
        }
      `}} />
    </div>
  );
};

export default TablaCategorias;