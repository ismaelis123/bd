import React, { useState } from "react";
import { supabase } from "../database/supabaseconfig";

function ModalEliminacionCategoria({ mostrar, onCerrar, categoria, onEliminado }) {
  const [cargando, setCargando] = useState(false);

  const eliminarCategoria = async () => {
    if (!categoria) return;

    setCargando(true);

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id_categoria", categoria.id_categoria);

    setCargando(false);

    if (error) {
      alert("Error al eliminar la categoría");
      console.error(error);
    } else {
      alert("Categoría eliminada correctamente 🗑️");
      onEliminado();
      onCerrar();
    }
  };

  if (!mostrar || !categoria) return null;

  return (
    <div className="modal-backdrop">
      <div className="card">
        <h2 className="text-danger">🗑️ Eliminar Categoría</h2>
        
        <p className="lead mb-1">¿Estás seguro de eliminar esta categoría?</p>
        <p className="fw-bold text-dark mb-4">"{categoria.nombre}"</p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button 
            className="btn btn-secondary" 
            onClick={onCerrar}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger" 
            onClick={eliminarCategoria}
            disabled={cargando}
          >
            {cargando ? "Eliminando..." : "Sí, Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminacionCategoria;