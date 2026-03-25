import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Productos from "./views/Productos";
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Pagina404 from "./views/Pagina404";

import Encabezado from "./navegacion/Encabezado";
import RutaProtegida from "./rutas/RutaProtegida";

import "./index.css";

function App() {
  return (
    <Router>
      <Encabezado />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />

        {/* Protegidas */}
        <Route
          path="/productos"
          element={
            <RutaProtegida>
              <Productos />
            </RutaProtegida>
          }
        />

        <Route
          path="/categorias"
          element={
            <RutaProtegida>
              <Categorias />
            </RutaProtegida>
          }
        />

        <Route
          path="/catalogo"
          element={
            <RutaProtegida>
              <Catalogo />
            </RutaProtegida>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}

export default App;