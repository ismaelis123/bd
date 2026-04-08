import { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";;
import ModalRegistroCategoria from "../categorias/ModalRegistroCategoria";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const obtenerCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*");

    if (!error) setCategorias(data);
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <div className="container">
      <h1>Categorías</h1>

      <button className="btn" onClick={() => setMostrarModal(true)}>
        + Nueva Categoría
      </button>

      <br /><br />

      <div>
        {categorias.map((cat) => (
          <div key={cat.id} className="card" style={{ marginBottom: "10px" }}>
            <h3>{cat.nombre}</h3>
            <p>{cat.descripcion}</p>
          </div>
        ))}
      </div>

      <ModalRegistroCategoria
        mostrar={mostrarModal}
        onCerrar={() => setMostrarModal(false)}
        onGuardado={obtenerCategorias}
      />
    </div>
  );
}

export default Categorias;