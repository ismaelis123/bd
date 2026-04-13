import React, { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";

function ModalEdicionCategoria({ mostrar, onCerrar, categoria, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion || "");
    }
  }, [categoria]);

  const guardarEdicion = async () => {
    if (!nombre) {
      alert("El nombre es obligatorio");
      return;
    }

    const { error } = await supabase
      .from("categorias")
      .update({ nombre, descripcion })
      .eq("id_categoria", categoria.id_categoria);

    if (error) {
      alert("Error al actualizar");
      console.error(error);
    } else {
      alert("Categoría actualizada ✅");
      onGuardado();
      onCerrar();
    }
  };

  if (!mostrar || !categoria) return null;

  return (
    <div className="modal-backdrop">
      <div className="card">
        <h2>✏️ Editar Categoría</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Descripción"
          rows="3"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={guardarEdicion}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdicionCategoria;