import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RutaPublica = ({ children }) => {
  const { usuario } = useAuth();
  return !usuario ? children : <Navigate to="/" replace />;
};

export default RutaPublica;