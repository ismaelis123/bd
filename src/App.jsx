import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Encabezado from "./navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Empleados from "./views/Empleados";

import Catalogo from "./components/Catalogo";

import Login from "./views/Login";

import RutaProtegida from "./rutas/RutaProtegida";

import Pagina404 from "./views/Pagina404";

import "./App.css";

const Layout = () => {

  const location = useLocation();

  return (
    <>

      {/* OCULTAR NAVBAR EN LOGIN */}
      {location.pathname !== "/login" && (
        <Encabezado />
      )}

      <main className="margen-superior-main">

        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* INICIO */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />

          {/* CATEGORÍAS */}
          <Route
            path="/categorias"
            element={
              <RutaProtegida>
                <Categorias />
              </RutaProtegida>
            }
          />

          {/* PRODUCTOS */}
          <Route
            path="/productos"
            element={
              <RutaProtegida>
                <Productos />
              </RutaProtegida>
            }
          />

          {/* EMPLEADOS */}
          <Route
            path="/empleados"
            element={
              <RutaProtegida>
                <Empleados />
              </RutaProtegida>
            }
          />

          {/* CATÁLOGO PÚBLICO */}
          <Route
            path="/catalogo"
            element={<Catalogo />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Pagina404 />}
          />

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