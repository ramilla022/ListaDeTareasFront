import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_PORT;

const TareasContext = createContext();

export function TareasProvider({ children }) {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario?.uid) {
      setTareas([]);
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/tarea/tareasUsuario/${usuario.uid}`)
      .then((res) => {
        setTareas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener tareas:", err);
        setLoading(false);
      });
  }, [usuario]);

  const agregarTarea = (tareaNueva) => {
    setTareas((prev) => [...prev, tareaNueva]);
  };

  const actualizarTarea = (tareaActualizada) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t))
    );
  };

  const eliminarTarea = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TareasContext.Provider
      value={{ tareas, setTareas, loading, agregarTarea, actualizarTarea, eliminarTarea }}
    >
      {children}
    </TareasContext.Provider>
  );
}

export const useTareas = () => useContext(TareasContext);