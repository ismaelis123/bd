import { useState } from "react";
import { supabase } from "../database/supabaseconfig";

function ModalRegistroCategoria({ mostrar, onCerrar, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  const guardarCategoria = async () => {
    if (cargando) return;

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    setCargando(true);

    // 🔥 VALIDAR DUPLICADO
    const { data: existe } = await supabase
      .from("categorias")
      .select("*")
      .ilike("nombre", nombre.trim());

    if (existe.length > 0) {
      alert("Ya existe esa categoría ⚠️");
      setCargando(false);
      return;
    }

    const { error } = await supabase
      .from("categorias")
      .insert([{ 
        nombre: nombre.trim(), 
        descripcion: descripcion.trim() 
      }]);

    setCargando(false);

    if (error) {
      alert("Error al guardar");
    } else {
      onGuardado();
      onCerrar();
      setNombre("");
      setDescripcion("");
    }
  };

  if (!mostrar) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Registrar Categoría</h3>

        <input
          style={styles.input}
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <div style={styles.actions}>
          <button onClick={onCerrar}>Cancelar</button>
          <button onClick={guardarCategoria} disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default ModalRegistroCategoria;