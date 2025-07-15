import { Routes, Route } from "react-router-dom";
import {Navbar} from './UI/Navbar';
import {TareasPage} from './Tareas/Pages/TareasPage';
import {LoginPage} from "./Tareas/Pages/LoginPage";
import {RegisterPage} from "./Tareas/Pages/RegisterPage";
import './Tareas.css'
import { CrearModificarTarea } from './Tareas/Pages/CrearModificarTarea'
import HistorialTareas from './Tareas/Pages/HistorialTareas';
import RutaPrivada from "./Routes/RutaPrivada";
import RutaPublica from "./Routes/RutaPublica";
import { useAuth } from "./Context/AuthContext";

function App() {
  const { usuario } = useAuth();

  return (
    <div className="app-container">
      {usuario && <Navbar />}
      <Routes>
        <Route path="/" element={
          <RutaPrivada><TareasPage estadoFiltro="Pendiente" /></RutaPrivada>
        } />
        <Route path="/historialTareas" element={
          <RutaPrivada><HistorialTareas /></RutaPrivada>
        } />
        <Route path="/crearTarea" element={
          <RutaPrivada><CrearModificarTarea modo="crear" /></RutaPrivada>
        } />
        <Route path="/modificar/:id" element={
          <RutaPrivada><CrearModificarTarea modo="modificar" /></RutaPrivada>
        } />
        <Route path="/Completadas" element={
          <RutaPrivada><TareasPage estadoFiltro="Completada" /></RutaPrivada>
        } />
        
        <Route path="/login" element={
          <RutaPublica><LoginPage /></RutaPublica>
        } />
        <Route path="/register" element={
          <RutaPublica><RegisterPage /></RutaPublica>
        } />
      </Routes>
    </div>
  );
}

export default App;