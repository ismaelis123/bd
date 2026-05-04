import React, { useEffect, useState } from "react";
import TarjetaCatalogo from "../catalogo/TarjetaCatalogo";
import { supabase } from "../database/supabaseconfig";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: productosData, error: errorProductos } =
      await supabase.from("productos").select("*");

    const { data: categoriasData, error: errorCategorias } =
      await supabase.from("categorias").select("*");

    if (!errorProductos) setProductos(productosData || []);
    if (!errorCategorias) setCategorias(categoriasData || []);
  };

  const manejarCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const productosFiltrados = productos.filter((p) =>
    categoriaSeleccionada === ""
      ? true
      : p.categoria_id == Number(categoriaSeleccionada)
  );

  const productosFinales = productosFiltrados.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Catálogo de Productos</h2>

      {/* FILTROS */}
      <div className="d-flex gap-3 mb-4">
        <select
          className="form-select"
          onChange={manejarCategoria}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto..."
          onChange={manejarBusqueda}
        />
      </div>

      {/* LISTA */}
      <div className="d-flex flex-wrap">
        {productosFinales.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productosFinales.map((p) => (
            <TarjetaCatalogo key={p.id_producto} producto={p} />
          ))
        )}
      </div>
    </div>
  );
};

export default Catalogo;