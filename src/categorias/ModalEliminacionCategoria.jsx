import React from "react";
import { supabase } from "../database/supabaseconfig";

function ModalEliminacionCategoria({ mostrar, onCerrar, categoria, onEliminado }) {

  const eliminarCategoria = async () => {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id_categoria", categoria.id_categoria);

    if (error) {
      alert("Error al eliminar la categoría");
      console.error(error);
    } else {
      alert("Categoría eliminada correctamente");
      onEliminado();
      onCerrar();
    }
  };

  if (!mostrar || !categoria) return null;

  return (
    <div className="modal-backdrop">
      <div className="card">
        <h2 className="text-danger">🗑️ Eliminar Categoría</h2>
        <p className="lead">
          ¿Estás seguro de eliminar la categoría <strong>"{categoria.nombre}"</strong>?
        </p>
        <p className="text-muted">Esta acción no se puede deshacer.</p>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={eliminarCategoria}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminacionCategoria;