import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';

const ModalRegistroProducto = ({ show, onHide, categorias, fetchData }) => {

  const [nuevo, setNuevo] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria_id: ''
  });

  const [imagen, setImagen] = useState(null);

  const handleGuardar = async () => {

    if (!nuevo.nombre || !nuevo.precio || !nuevo.categoria_id) {
      alert("Campos obligatorios");
      return;
    }

    let urlImagen = null;

    // 🔥 SUBIR IMAGEN
    if (imagen) {
      const nombreArchivo = `${Date.now()}_${imagen.name}`;

      const { error: uploadError } = await supabase.storage
        .from('imagenes_productos')
        .upload(nombreArchivo, imagen);

      if (uploadError) {
        alert("Error subiendo imagen");
        return;
      }

      const { data } = supabase.storage
        .from('imagenes_productos')
        .getPublicUrl(nombreArchivo);

      urlImagen = data.publicUrl;
    }

    // 🔥 INSERTAR PRODUCTO
    const { error } = await supabase.from('productos').insert([{
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      stock: parseInt(nuevo.stock) || 0,
      categoria_id: parseInt(nuevo.categoria_id),
      url_imagen: urlImagen
    }]);

    if (error) {
      alert(error.message);
    } else {
      onHide();
      fetchData();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>Nuevo Producto</Modal.Title></Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Control className="mb-2" placeholder="Nombre"
            onChange={(e) => setNuevo({...nuevo, nombre: e.target.value})} />

          <Form.Select className="mb-2"
            onChange={(e) => setNuevo({...nuevo, categoria_id: e.target.value})}>
            <option value="">Categoría</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
            ))}
          </Form.Select>

          <Form.Control type="number" className="mb-2" placeholder="Precio"
            onChange={(e) => setNuevo({...nuevo, precio: e.target.value})} />

          <Form.Control type="number" className="mb-2" placeholder="Stock"
            onChange={(e) => setNuevo({...nuevo, stock: e.target.value})} />

          <Form.Control type="file" accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])} />

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleGuardar}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;