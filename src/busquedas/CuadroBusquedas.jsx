import { Form } from "react-bootstrap";

function CuadroBusquedas({ texto, onChange }) {
  return (
    <Form.Control
      type="text"
      placeholder="🔍 Buscar categoría..."
      value={texto}
      onChange={(e) => onChange(e.target.value)}
      className="mb-3"
    />
  );
}

export default CuadroBusquedas;