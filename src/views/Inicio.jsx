import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import jsPDF from "jspdf"; 
import autoTable from "jspdf-autotable"; 
import html2canvas from "html2canvas"; 

// Componentes de Recharts para pintar los gráficos interactivos
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";

const Inicio = () => {
  // Estados dinámicos conectados a Supabase
  const [totalVentas, setTotalVentas] = useState(0);
  const [ventasEfectivo, setVentasEfectivo] = useState(0);
  const [ventasTarjeta, setVentasTarjeta] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0);
  const [transacciones, setTransacciones] = useState(0);
  const [datosGraficoHora, setDatosGraficoHora] = useState([]);
  const [datosGraficoCategoria, setDatosGraficoCategoria] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Referencias para capturar los componentes visuales con html2canvas [cite: 16]
  const graficoHoraRef = useRef(null); 
  const graficoCategoriaRef = useRef(null);

  const fechaDesde = "2026-06-01";
  const fechaHasta = "2026-06-30";

  // Colores vivos para las secciones de la dona
  const COLORES_PASTEL = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6c757d"];

  useEffect(() => {
    cargarMesaDeControl();

    // 🔥 CANALES EN TIEMPO REAL RE-CONFIGURADOS
    const canalVentas = supabase
      .channel("cambios-ventas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ventas" },
        () => { cargarMesaDeControl(); }
      )
      .subscribe();

    const canalDetalles = supabase
      .channel("cambios-detalles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "detalle_ventas" },
        () => { cargarMesaDeControl(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalVentas);
      supabase.removeChannel(canalDetalles);
    };
  }, []);

  const cargarMesaDeControl = async () => {
    try {
      setCargando(true);

      // 1. Obtener ventas con los campos reales de tu BD (total, fecha_venta, tipo_pago)
      const { data: ventas, error: errVentas } = await supabase
        .from("ventas")
        .select("total, fecha_venta, tipo_pago");
      
      if (errVentas) throw errVentas;

      // 2. Traer los detalles haciendo JOIN con Productos y Categorías usando tu estructura de BD
      const { data: detalles, error: errDetalles } = await supabase
        .from("detalle_ventas")
        .select(`
          cantidad,
          productos (
            categorias (
              nombre
            )
          )
        `);

      if (errDetalles) throw errDetalles;

      // --- CÁLCULO DE TARJETAS METRICAS ---
      const sumaVentas = ventas ? ventas.reduce((acc, v) => acc + Number(v.total), 0) : 0;
      const sumaProductos = detalles ? detalles.reduce((acc, d) => acc + Number(d.cantidad), 0) : 0;
      const conteoTransacciones = ventas ? ventas.length : 0;

      // Desglose por tipo de pago solicitado por la guía 
      const efectivo = ventas ? ventas.filter(v => v.tipo_pago === "Efectivo" || v.tipo_pago === "efectivo").reduce((acc, v) => acc + Number(v.total), 0) : 0;
      const tarjeta = ventas ? ventas.filter(v => v.tipo_pago === "Tarjeta" || v.tipo_pago === "tarjeta").reduce((acc, v) => acc + Number(v.total), 0) : 0;

      setTotalVentas(sumaVentas);
      setProductosVendidos(sumaProductos);
      setTransacciones(conteoTransacciones);
      setVentasEfectivo(efectivo);
      setVentasTarjeta(tarjeta);

      // --- GRÁFICO 1: VENTAS POR HORA (Usando fecha_venta) ---
      const balanzaHoras = { "08:00 AM": 0, "12:00 PM": 0, "04:00 PM": 0 };
      
      if (ventas) {
        ventas.forEach((v) => {
          if (v.fecha_venta) {
            // Extrae la hora del string ISO de manera segura
            const horaMilitar = parseInt(v.fecha_venta.substring(11, 13), 10);
            
            if (horaMilitar >= 6 && horaMilitar < 12) {
              balanzaHoras["08:00 AM"] += Number(v.total);
            } else if (horaMilitar >= 12 && horaMilitar < 16) {
              balanzaHoras["12:00 PM"] += Number(v.total);
            } else {
              balanzaHoras["04:00 PM"] += Number(v.total);
            }
          }
        });
      }

      setDatosGraficoHora(Object.keys(balanzaHoras).map((key) => ({
        hora: key,
        monto: balanzaHoras[key],
      })));

      // --- GRÁFICO 2: VENTAS POR CATEGORÍA (Mapeo por la relación de tu BD) ---
      const bolsaCategorias = {};
      if (detalles) {
        detalles.forEach((d) => {
          // Accedemos mediante la jerarquía del JOIN realizado
          const nombreCat = d.productos?.categorias?.nombre || "Ferretería General";
          bolsaCategorias[nombreCat] = (bolsaCategorias[nombreCat] || 0) + Number(d.cantidad);
        });
      }

      setDatosGraficoCategoria(Object.keys(bolsaCategorias).map((key) => ({
        name: key,
        value: bolsaCategorias[key],
      })));

    } catch (error) {
      console.error("Error cargando métricas reales: ", error);
    } finally {
      setCargando(false);
    }
  };

  // --- REPORTES REQUERIDOS POR LA GUÍA ---
  
  // 1. Reporte de Ventas por Hora 
  const generarPdfVentasHora = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(18); pdf.setTextColor("#330775"); pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Hora", 14, 15);
      
      pdf.setFont("helvetica", "normal"); pdf.setTextColor("#000000"); pdf.setFontSize(10);
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

      if (graficoHoraRef.current) {
        const canvas = await html2canvas(graficoHoraRef.current);
        const imagen = canvas.toDataURL("image/png");
        pdf.addImage(imagen, "PNG", 10, 30, 190, 80);
      }

      pdf.setFontSize(14); pdf.setTextColor("#330775"); pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", 14, 115);
      pdf.setFont("helvetica", "normal"); pdf.setTextColor("#000000"); pdf.setFontSize(10);
      
      pdf.text(`Total Ventas: C$ ${totalVentas.toFixed(2)}`, 14, 125);
      pdf.text(`Ventas Efectivo: C$ ${ventasEfectivo.toFixed(2)}`, 14, 132);
      pdf.text(`Ventas Tarjeta: C$ ${ventasTarjeta.toFixed(2)}`, 14, 139);
      pdf.text(`Productos Vendidos: ${productosVendidos}`, 14, 146);
      pdf.text(`Cantidad Ventas: ${transacciones}`, 14, 153);

      const filas = datosGraficoHora.map(item => [item.hora, `C$ ${item.monto.toFixed(2)}`]);

      autoTable(pdf, {
        startY: 160,
        head: [["Hora", "Monto Acumulado"]],
        body: filas,
        theme: "striped"
      });

      const fechaActual = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      pdf.save(`VentasHora_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF");
    }
  };

  // 2. Reporte de Ventas por Categoría [cite: 24]
  const generarPdfVentasCategoria = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(18); pdf.setTextColor("#198754"); pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Categoría", 14, 15);

      if (graficoCategoriaRef.current) {
        const canvas = await html2canvas(graficoCategoriaRef.current);
        const imagen = canvas.toDataURL("image/png");
        pdf.addImage(imagen, "PNG", 10, 30, 190, 85);
      }

      const matrizFilas = datosGraficoCategoria.map(item => [item.name, `${item.value} unidades`]);

      autoTable(pdf, {
        startY: 125,
        head: [["Línea de Producto / Categoría", "Volumen Despachado"]],
        body: matrizFilas,
        theme: "grid"
      });

      pdf.save("Reporte_Ventas_Por_Categoria.pdf");
    } catch (error) {
      alert("Error en PDF de categorías");
    }
  };

  // 3. Reporte PDF de Estadística General [cite: 25]
  const generarPdfGeneral = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(22); pdf.setTextColor("#0d6efd"); pdf.setFont("helvetica", "bold");
    pdf.text("REPORTE OPERATIVO DE SUCURSAL", 14, 20);
    
    pdf.setFontSize(12); pdf.setTextColor("#212529"); pdf.setFont("helvetica", "normal");
    pdf.text(`Monto Total Facturado: C$ ${totalVentas.toFixed(2)}`, 14, 40);
    pdf.text(`Ventas en Efectivo: C$ ${ventasEfectivo.toFixed(2)}`, 14, 50);
    pdf.text(`Ventas con Tarjeta: C$ ${ventasTarjeta.toFixed(2)}`, 14, 60);
    pdf.text(`Unidades Totales Vendidas: ${productosVendidos} items`, 14, 70);
    pdf.text(`Transacciones Totales en Caja: ${transacciones}`, 14, 80);
    
    pdf.save("Resumen_Estadistico_LaredoKit.pdf");
  };

  return (
    <Container className="mt-4">
      {/* ENCABEZADO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-semibold text-dark">Panel de Control Estadístico</h3>
        <div>
          <Button variant="success" className="me-2 fw-medium">📊 Excel General</Button>
          <Button variant="danger" className="fw-medium" onClick={generarPdfGeneral}>📕 PDF General</Button> 
        </div>
      </div>

      {/* TARJETAS OPERATIVAS */}
      <Row className="mb-4">
        <Col md={4}>
          <Card bg="primary" text="white" className="shadow-sm border-0 p-4 mb-3 rounded-3">
            <span className="text-white-50 small text-uppercase fw-bold">Total Ventas</span>
            <h2 className="mt-2 fw-bold">C$ {totalVentas.toFixed(2)}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="success" text="white" className="shadow-sm border-0 p-4 mb-3 rounded-3">
            <span className="text-white-50 small text-uppercase fw-bold">Productos Vendidos</span>
            <h2 className="mt-2 fw-bold">{productosVendidos}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="dark" text="white" className="shadow-sm border-0 p-4 mb-3 rounded-3">
            <span className="text-white-50 small text-uppercase fw-bold">Transacciones</span>
            <h2 className="mt-2 fw-bold">{transacciones}</h2>
          </Card>
        </Col>
      </Row>

      {/* GRÁFICOS */}
      <Row>
        {/* GRÁFICO 1: FLUJO POR HORA */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
            <Card.Body ref={graficoHoraRef} className="p-4"> {/* [cite: 18] */}
              <h5 className="fw-bold text-secondary mb-4">Flujo de Ventas por Hora</h5>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGraficoHora} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hora" tick={{ fill: '#6c757d', fontSize: 13 }} />
                    <YAxis tick={{ fill: '#6c757d', fontSize: 13 }} />
                    <Tooltip formatter={(value) => `C$ ${value.toFixed(2)}`} />
                    <Bar dataKey="monto" fill="#0d6efd" radius={[6, 6, 0, 0]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
            <div className="bg-light p-3 text-center border-top">
              <Button variant="outline-danger" className="px-4 btn-sm fw-medium" onClick={generarPdfVentasHora}>
                Descargar PDF Hora
              </Button>
            </div>
          </Card>
        </Col>

        {/* GRÁFICO 2: DISTRIBUCIÓN POR CATEGORÍA */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
            <Card.Body ref={graficoCategoriaRef} className="p-4">
              <h5 className="fw-bold text-secondary mb-4">Ventas por Categoría de Productos</h5>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosGraficoCategoria}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {datosGraficoCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES_PASTEL[index % COLORES_PASTEL.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} unidades`} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
            <div className="bg-light p-3 text-center border-top">
              <Button variant="outline-danger" className="px-4 btn-sm fw-medium" onClick={generarPdfVentasCategoria}>
                Descargar PDF Categoría
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;