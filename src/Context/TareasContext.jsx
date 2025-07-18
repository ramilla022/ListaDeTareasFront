import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_PORT;
const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = async (usuarioId) => {
    try {
      const res = await axios.get(`${API_URL}/api/tarea/historialUsuario/${usuarioId}`);
      setHistorial(res.data);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    }
  };

  const fetchTareas = async (usuarioId) => {
    try {
      const res = await axios.get(`${API_URL}/api/tarea/tareasUsuario/${usuarioId}`);
      setTareas(res.data);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    }
  };

  useEffect(() => {
    if (!usuario?.uid) {
      setTareas([]);
      setHistorial([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([fetchTareas(usuario.uid), fetchHistorial(usuario.uid)])
      .finally(() => setLoading(false));
  }, [usuario]);

  const agregarTarea = (tareaNueva) => {
    setTareas(prev => [...prev, tareaNueva]);
    fetchHistorial(usuario.uid);
  };

  const actualizarTarea = (tareaActualizada) => {
    setTareas(prev => prev.map(t => (t.id === tareaActualizada.id ? tareaActualizada : t)));
    fetchHistorial(usuario.uid);
  };

  const eliminarTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
    fetchHistorial(usuario.uid);
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        setTareas,
        historial,
        setHistorial,
        loading,
        agregarTarea,
        actualizarTarea,
        eliminarTarea,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
}

export const useTareas = () => useContext(TareasContext);