import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';

const ModalEdicionProducto = ({ show, onHide, producto, categorias, fetchData }) => {

  const [editado, setEditado] = useState({});
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (producto) setEditado(producto);
  }, [producto]);

  const handleUpdate = async () => {

    let urlImagen = editado.url_imagen;

    // 🔥 SI HAY NUEVA IMAGEN
    if (imagen) {

      const nombreArchivo = `${Date.now()}_${imagen.name}`;

      const { error: uploadError } = await supabase.storage
        .from('imagenes_productos')
        .upload(nombreArchivo, imagen);

      if (uploadError) return alert(uploadError.message);

      const { data } = supabase.storage
        .from('imagenes_productos')
        .getPublicUrl(nombreArchivo);

      urlImagen = data.publicUrl;

      // 🔥 BORRAR IMAGEN ANTERIOR
      if (editado.url_imagen) {
        const nombreViejo = editado.url_imagen.split('/').pop();

        await supabase.storage
          .from('imagenes_productos')
          .remove([nombreViejo]);
      }
    }

    const { error } = await supabase
      .from('productos')
      .update({
        nombre: editado.nombre,
        precio: parseFloat(editado.precio),
        stock: parseInt(editado.stock),
        categoria_id: parseInt(editado.categoria_id),
        url_imagen: urlImagen
      })
      .eq('id_producto', editado.id_producto);

    if (!error) {
      onHide();
      fetchData();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>

      <Modal.Header closeButton><Modal.Title>Editar</Modal.Title></Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Control className="mb-2"
            value={editado.nombre || ''}
            onChange={(e) => setEditado({...editado, nombre: e.target.value})} />

          <Form.Select className="mb-2"
            value={editado.categoria_id || ''}
            onChange={(e) => setEditado({...editado, categoria_id: e.target.value})}>
            <option value="">Categoría</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
            ))}
          </Form.Select>

          <Form.Control type="number" className="mb-2"
            value={editado.precio || ''}
            onChange={(e) => setEditado({...editado, precio: e.target.value})} />

          <Form.Control type="number" className="mb-2"
            value={editado.stock || ''}
            onChange={(e) => setEditado({...editado, stock: e.target.value})} />

          <Form.Control type="file"
            onChange={(e) => setImagen(e.target.files[0])} />

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleUpdate}>Actualizar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;