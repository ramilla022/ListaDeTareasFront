import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_PORT;

const TareasContext = createContext();

export function TareasProvider({ children }) {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario?.uid) {
      setTareas([]);
      setHistorial([]);
      setLoading(false);
      return;
    }

    const historialLocal = localStorage.getItem(`historial_${usuario.uid}`);
    if (historialLocal) {
      setHistorial(JSON.parse(historialLocal));
    } else {
      setHistorial([]);
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

  useEffect(() => {
    if (usuario?.uid) {
      localStorage.setItem(`historial_${usuario.uid}`, JSON.stringify(historial));
    }
  }, [historial, usuario]);

  const agregarEventoHistorial = (descripcion) => {
    setHistorial((prev) => [
      ...prev,
      {
        descripcion,
        fecha: new Date().toISOString(),
      },
    ]);
  };

  const agregarTarea = (tareaNueva) => {
    setTareas((prev) => [...prev, tareaNueva]);
    agregarEventoHistorial(`Tarea creada: "${tareaNueva.descripcion}"`);
  };

  const actualizarTarea = (tareaActualizada) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t))
    );
  };

  const eliminarTarea = (id) => {
    const tareaEliminada = tareas.find((t) => t.id === id);
    setTareas((prev) => prev.filter((t) => t.id !== id));
    if (tareaEliminada) {
      agregarEventoHistorial(`Tarea eliminada: "${tareaEliminada.descripcion}"`);
    }
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        setTareas,
        historial,
        agregarEventoHistorial,
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