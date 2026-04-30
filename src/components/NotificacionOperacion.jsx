import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function NotificacionOperacion({ mostrar, mensaje, tipo, onCerrar }) {
  // Configuramos el color según el tipo de operación
  const obtenerColor = () => {
    switch (tipo) {
      case 'exito': return 'success';
      case 'error': return 'danger';
      case 'advertencia': return 'warning';
      default: return 'primary';
    }
  };

  return (
    // "top-center" lo pone arriba en el medio. 
    // Si lo querés en el puro centro de la pantalla usá "middle-center"
    <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
      <Toast 
        show={mostrar} 
        onClose={onCerrar} 
        delay={2500} 
        autohide 
        bg={obtenerColor()}
        className="text-white border-0 shadow-lg"
      >
        <Toast.Header closeButton={true}>
          <strong className="me-auto text-dark">
            {tipo === 'exito' ? '✅ ¡Hecho!' : '⚠️ Aviso'}
          </strong>
        </Toast.Header>
        <Toast.Body>
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default NotificacionOperacion;