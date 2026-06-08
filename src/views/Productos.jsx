import React, { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseconfig'; 
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

import ModalRegistroProducto from '../productos/ModalRegistroProducto';
import ModalEdicionProducto from '../productos/ModalEdicionProducto';
import TarjetasProductos from '../productos/TarjetasProductos';
import NotificacionOperacion from '../components/NotificacionOperacion';

// 1. IMPORTAR EL NUEVO MODAL DE QR
import ModalQRProducto from '../productos/ModalQRProducto';

const Productos = () => {

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const [showRegistro, setShowRegistro] = useState(false);
  const [showEdicion, setShowEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // 🔔 ESTADOS PARA EL CODIGO QR
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [productoQR, setProductoQR] = useState(null);

  // 🔔 NOTIFICACIONES
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');
  const [tipoToast, setTipoToast] = useState('exito');

  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setMensajeToast(mensaje);
    setTipoToast(tipo);
    setMostrarToast(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [busqueda, filtroCategoria, productos]);

  const fetchData = async () => {
    const { data: catData } = await supabase
      .from('categorias')
      .select('*');

    setCategorias(catData || []);

    const { data: prodData } = await supabase
      .from('productos')
      .select('*')
      .order('id_producto', { ascending: false });

    setProductos(prodData || []);
  };

  const filtrarProductos = () => {
    let filtrados = [...productos];

    if (busqueda) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroCategoria) {
      filtrados = filtrados.filter(p =>
        p.categoria_id == filtroCategoria
      );
    }

    setProductosFiltrados(filtrados);
  };

  // 🛠️ MÉTODO PARA GENERAR QR (Validando con tus notificaciones existentes)
  const generarQRImagen = (producto) => {
    if (!producto?.url_imagen) {
      mostrarNotificacion("Este producto no tiene imagen asociada ⚠️", "advertencia");
      return;
    }
    setProductoQR(producto);
    setMostrarModalQR(true);
  };

  // 🗑️ ELIMINAR PRODUCTO
  const eliminarProducto = async (id, url_imagen) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      // eliminar imagen del storage
      if (url_imagen) {
        const nombre = url_imagen.split('/').pop();

        await supabase.storage
          .from('imagenes_productos')
          .remove([nombre]);
      }

      // eliminar de la tabla
      await supabase
        .from('productos')
        .delete()
        .eq('id_producto', id);

      mostrarNotificacion("Producto eliminado 🗑️", "exito");
      fetchData();

    } catch (error) {
      mostrarNotificacion("Error al eliminar ❌", "error");
    }
  };

  return (
    <Container className="mt-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Inventario</h5>
        <Button onClick={() => setShowRegistro(true)}>+ Nuevo</Button>
      </div>

      {/* 🔍 BUSCADOR + FILTRO */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>

        <Col md={6}>
          <Form.Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* 🛍️ TARJETAS (Se pasa la función generarQRImagen como prop) */}
      <TarjetasProductos
        productos={productosFiltrados}
        categorias={categorias}
        abrirEdicion={(p) => {
          setProductoSeleccionado(p);
          setShowEdicion(true);
        }}
        eliminarProducto={eliminarProducto}
        generarQRImagen={generarQRImagen} 
      />

      {/* MODAL REGISTRO */}
      <ModalRegistroProducto
        show={showRegistro}
        onHide={() => setShowRegistro(false)}
        categorias={categorias}
        fetchData={fetchData}
        mostrarNotificacion={mostrarNotificacion}
      />

      {/* MODAL EDICIÓN */}
      {productoSeleccionado && (
        <ModalEdicionProducto
          show={showEdicion}
          onHide={() => {
            setShowEdicion(false);
            setProductoSeleccionado(null);
          }}
          producto={productoSeleccionado}
          categorias={categorias}
          fetchData={fetchData}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}

      {/* 2. NUEVO MODAL DE VISUALIZACIÓN QR DINÁMICO */}
      <ModalQRProducto
        mostrar={mostrarModalQR}
        onHide={() => setMostrarModalQR(false)}
        producto={productoQR}
      />

      {/* 🔔 TOAST */}
      <NotificacionOperacion
        mostrar={mostrarToast}
        mensaje={mensajeToast}
        tipo={tipoToast}
        onCerrar={() => setMostrarToast(false)}
      />

    </Container>
  );
};

export default Productos;