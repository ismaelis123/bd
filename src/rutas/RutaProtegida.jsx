import { Navigate } from "react-router-dom";

function RutaProtegida({ children }) {

  const usuario = true;

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutaProtegida;