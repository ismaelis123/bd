// ==========================================
// 📁 src/components/empleados/TablaEmpleados.jsx
// ==========================================

import React from "react";
import { Table, Button, Badge, Card } from "react-bootstrap";

const TablaEmpleados = ({
  empleados,
  abrirModalEdicion,
  eliminarEmpleado
}) => {

  return (

    <Card className="shadow-sm border-0">

      <Table
        hover
        responsive
        className="align-middle mb-0 text-center"
      >

        <thead className="table-light">

          <tr>

            <th>ID</th>
            <th>Empleado</th>
            <th>Celular</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {empleados.map(emp => (

            <tr key={emp.id_empleado}>

              <td>{emp.id_empleado}</td>

              <td className="fw-semibold">
                {emp.nombre_empleado} {emp.apellido_empleado}
              </td>

              <td>{emp.celular}</td>

              <td>{emp.email}</td>

              <td>

                <Badge bg={
                  emp.tipo_empleado === "Administrador"
                    ? "danger"
                    : "primary"
                }>
                  {emp.tipo_empleado}
                </Badge>

              </td>

              <td>

                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => abrirModalEdicion(emp)}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() =>
                    eliminarEmpleado(
                      emp.id_empleado,
                      emp.nombre_empleado
                    )
                  }
                >
                  Eliminar
                </Button>

              </td>

            </tr>

          ))}

        </tbody>

      </Table>

    </Card>

  );
};

export default TablaEmpleados;