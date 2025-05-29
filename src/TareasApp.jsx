import { Routes, Route } from "react-router-dom";
import Navbar from './UI/Navbar';
import TareasPage from './Tareas/Pages/TareasPage';
import LoginPage from "./Tareas/Pages/LoginPage";
import RegisterPage from "./Tareas/Pages/RegisterPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TareasPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;