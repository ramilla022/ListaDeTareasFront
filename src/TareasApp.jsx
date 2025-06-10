import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from './UI/Navbar';
import TareasPage from './Tareas/Pages/TareasPage';
import LoginPage from "./Tareas/Pages/LoginPage";
import RegisterPage from "./Tareas/Pages/RegisterPage";

import { useAuth } from "./Context/AuthContext"; 
import CrearTarea from "./Tareas/Pages/crearTarea";
import ModificarTarea from "./Tareas/Pages/ModificarTarea";
import HistorialTareas from './Tareas/Pages/HistorialTareas'

function App() {
  const { usuario } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          usuario ? <TareasPage estadoFiltro="Pendiente" /> : <Navigate to="/login" replace />
        } />
         <Route path="/historialTareas" element={
          usuario ? <HistorialTareas /> : <Navigate to="/login" replace />
        } />
         <Route path="/crearTarea" element={
          usuario ? <CrearTarea /> : <Navigate to="/login" replace />
        } />
        <Route path="/Completadas" element={
          usuario ? <TareasPage estadoFiltro="Completada" /> : <Navigate to="/login" replace />
        } />
        <Route path="/modificar/:id" element={
          usuario ? <ModificarTarea /> : <Navigate to="/login" replace />
        } />
       

        <Route path="/login" element={
          !usuario ? <LoginPage /> : <Navigate to="/" replace />
        } />

        <Route path="/register" element={
          !usuario ? <RegisterPage /> : <Navigate to="/" replace />
        } />
      </Routes>
    </>
  );
}

export default App;