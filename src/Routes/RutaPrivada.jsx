import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RutaPrivada = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
};

export default RutaPrivada;