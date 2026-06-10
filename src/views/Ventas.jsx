import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  
  // Estado para el formulario de selección
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [tipoPago, setTipoPago] = useState("Efectivo");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");

  // Estado del Carrito de Compras
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Traer productos con stock disponible
    const { data: prodData } = await supabase
      .from("productos")
      .select("*")
      .gt("stock", 0)
      .order("nombre", { ascending: true });
    setProductos(prodData || []);

    // Traer empleados usando la columna exacta de tu base de datos
    const { data: empData } = await supabase
      .from("empleados")
      .select("*")
      .order("nombre_empleado", { ascending: true });
    setEmpleados(empData || []);
  };

  // Agregar un producto al carrito temporal
  const agregarAlCarrito = (e) => {
    e.preventDefault();
    if (!productoSeleccionado) return alert("Selecciona un producto");

    const prod = productos.find((p) => p.id_producto === parseInt(productoSeleccionado));
    if (!prod) return;

    if (cantidad > prod.stock) {
      return alert(`Stock insuficiente. Solo quedan ${prod.stock} unidades de este producto.`);
    }

    // Verificar si ya existe en el carrito para sumar la cantidad
    const existe = carrito.find((item) => item.id_producto === prod.id_producto);
    if (existe) {
      if (existe.cantidad + cantidad > prod.stock) {
        return alert("La cantidad acumulada supera el stock disponible.");
      }
      setCarrito(
        carrito.map((item) =>
          item.id_producto === prod.id_producto
            ? { ...item, cantidad: item.cantidad + parseInt(cantidad) }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...prod, cantidad: parseInt(cantidad) }]);
    }

    // Resetear campos
    setProductoSeleccionado("");
    setCantidad(1);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id_producto !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  // GUARDAR VENTA EN LA BASE DE DATOS
  const procesarVenta = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    if (!empleadoSeleccionado) return alert("Por favor, seleccione el empleado que realiza la venta");

    try {
      setCargando(true);
      const totalVenta = calcularTotal();

      // 1. Insertar en la tabla maestra 'ventas'
      const { data: nuevaVenta, error: errorVenta } = await supabase
        .from("ventas")
        .insert([
          {
            total: totalVenta,
            tipo_pago: tipoPago,
            empleado_id: parseInt(empleadoSeleccionado),
          },
        ])
        .select()
        .single();

      if (errorVenta) throw errorVenta;

      // 2. Recorrer el carrito para guardar detalles y restar inventario
      for (const item of carrito) {
        // Insertar en 'detalle_ventas'
        const { error: errorDetalle } = await supabase.from("detalle_ventas").insert([
          {
            venta_id: nuevaVenta.id_venta,
            producto_id: item.id_producto,
            cantidad: item.cantidad, // 👈 ¡TOTALMENTE CORREGIDO AQUÍ! (Ya no dice 'amount')
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad,
          },
        ]);

        if (errorDetalle) throw errorDetalle;

        // Restar stock en la tabla 'productos'
        const { error: errorStock } = await supabase
          .from("productos")
          .update({ stock: item.stock - item.cantidad })
          .eq("id_producto", item.id_producto);

        if (errorStock) throw errorStock;
      }

      alert("¡Venta registrada con éxito y stock actualizado! 🛒🔥");
      setCarrito([]);
      setEmpleadoSeleccionado("");
      cargarDatos(); // Recargar productos con los nuevos stocks
    } catch (error) {
      console.error(error);
      alert("Error crítico al procesar la venta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">🛒 Módulo de Facturación y Ventas</h3>
      
      <Row>
        {/* PANEL DE SELECCIÓN DE PRODUCTOS */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 p-3">
            <h5 className="text-primary mb-3">Añadir al Carrito</h5>
            <Form onSubmit={agregarAlCarrito}>
              
              <Form.Group className="mb-3">
                <Form.Label>Empleado en Caja</Form.Label>
                <Form.Select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  required
                >
                  <option value="">-- Seleccione Atendió --</option>
                  {empleados.map((e) => (
                    <option key={e.id_empleado} value={e.id_empleado}>
                      {e.nombre_empleado}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Producto</Form.Label>
                <Form.Select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                >
                  <option value="">-- Seleccione Producto --</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre} (Stock: {p.stock} | C$ {p.precio})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cantidad a vender</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                ➕ Agregar Producto
              </Button>
            </Form>
          </Card>
        </Col>

        {/* DETALLE DEL CARRITO Y TOTALES */}
        <Col md={8}>
          <Card className="shadow-sm border-0 p-3">
            <h5 className="mb-3">Artículos en la Venta Actual</h5>
            
            {carrito.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                El carrito está vacío. Agrega productos para iniciar el cobro.
              </div>
            ) : (
              <>
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id_producto}>
                        <td>{item.nombre}</td>
                        <td>C$ {Number(item.precio).toFixed(2)}</td>
                        <td>
                          <Badge bg="secondary" className="fs-6">{item.cantidad}</Badge>
                        </td>
                        <td className="fw-bold">C$ {(item.precio * item.cantidad).toFixed(2)}</td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => eliminarDelCarrito(item.id_producto)}>
                            ❌
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <hr />

                {/* OPCIONES DE PAGO Y CIERRE */}
                <Row className="align-items-center mt-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Método de Pago:</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          label="💵 Efectivo"
                          name="pago"
                          checked={tipoPago === "Efectivo"}
                          onChange={() => setTipoPago("Efectivo")}
                        />
                        <Form.Check
                          type="radio"
                          label="💳 Tarjeta"
                          name="pago"
                          checked={tipoPago === "Tarjeta"}
                          onChange={() => setTipoPago("Tarjeta")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col sm={6} className="text-sm-end mt-3 mt-sm-0">
                    <h4>Total a Pagar:</h4>
                    <h2 className="text-success fw-bold">C$ {calcularTotal().toFixed(2)}</h2>
                  </Col>
                </Row>

                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100 mt-4" 
                  onClick={procesarVenta}
                  disabled={cargando}
                >
                  {cargando ? "Procesando Venta..." : "🚀 Confirmar y Registrar Venta"}
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ventas;