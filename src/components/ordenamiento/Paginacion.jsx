import { Pagination } from "react-bootstrap";

function Paginacion({ totalPaginas, paginaActual, setPaginaActual }) {
  let items = [];

  for (let i = 1; i <= totalPaginas; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === paginaActual}
        onClick={() => setPaginaActual(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return <Pagination>{items}</Pagination>;
}

export default Paginacion;