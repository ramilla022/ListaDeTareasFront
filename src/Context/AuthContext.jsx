import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORT;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async ({ email, password, nombre }) => {
    try {
      const res = await axios.post(`${API_URL}/api/usuario/registro`, {
        email,
        password,
        nombre,
      });
      setUsuario(res.data.usuario);
      localStorage.setItem("user", JSON.stringify(res.data.usuario));
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error('Error al registrar usuario:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensaje || 'Error en el registro');
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${API_URL}/api/usuario/login`, {
        email,
        password,
      });

      const { usuario: userData, token } = res.data;

      setUsuario(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ usuario, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);