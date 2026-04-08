import { useState } from "react";
import { supabase } from "../database/supabaseconfig";

function ModalRegistroCategoria({ mostrar, onCerrar, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const guardarCategoria = async () => {
    if (!nombre) {
      alert("El nombre es obligatorio");
      return;
    }

    const { error } = await supabase
      .from("categorias")
      .insert([{ nombre, descripcion }]);

    if (error) {
      alert("Error al guardar");
      console.log(error);
    } else {
      alert("Categoría guardada ✅");
      onGuardado();
      onCerrar();
      setNombre("");
      setDescripcion("");
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal-backdrop">
      <div className="card">
        <h2>Registrar Categoría</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <br /><br />

        <button className="btn" onClick={guardarCategoria}>
          Guardar
        </button>

        <button className="btn" onClick={onCerrar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ModalRegistroCategoria;