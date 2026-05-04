import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Encabezado from "./navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Catalogo from "./components/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import RutaProtegida from "./rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <Encabezado />}

      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />

          {/* CATÁLOGO PÚBLICO */}
          <Route path="/catalogo" element={<Catalogo />} />

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;