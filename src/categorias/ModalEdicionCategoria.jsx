import React, { useState, useEffect } from "react";
import { supabase } from "../database/supabaseconfig";

function ModalEdicionCategoria({ mostrar, onCerrar, categoria, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre || "");
      setDescripcion(categoria.descripcion || "");
    }
  }, [categoria]);

  const actualizar = async () => {
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    setCargando(true);
    const { error } = await supabase
      .from("categorias")
      .update({ nombre: nombre.trim(), descripcion: descripcion.trim() })
      .eq("id_categoria", categoria.id_categoria);

    setCargando(false);

    if (error) alert("Error al actualizar");
    else {
      alert("Categoría actualizada ✅");
      onGuardado();
      onCerrar();
    }
  };

  if (!mostrar || !categoria) return null;

  return (
    <div className="modal-backdrop">
      <div className="card" style={{ maxWidth: "420px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          ✏️ Editar Categoría
        </h2>

        <input
          type="text"
          className="form-control mb-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />

        <textarea
          className="form-control mb-3"
          rows="3"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-secondary" onClick={onCerrar} disabled={cargando}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={actualizar} disabled={cargando}>
            {cargando ? "Actualizando..." : "Actualizar Categoría"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdicionCategoria;