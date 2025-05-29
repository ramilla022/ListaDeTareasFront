import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../Api/Firebase';  
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const API_URL = import.meta.env.VITE_PORT;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);


  const register = async ({ email, password, nombre }) => {
    try {
      const res = await axios.post(`${API_URL}/api/usuario/registro`, {
        email,
        password,
        nombre,
      });
      setUsuario(res.data.usuario);
  
    } catch (error) {
      console.error('Error al registrar usuario:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensaje || 'Error en el registro');
    }
  };


  const login = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setUsuario({
        uid: user.uid,
        email: user.email,
        nombre: user.displayName || null,
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error(error.message);
    }
  };


  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({
          uid: user.uid,
          email: user.email,
          nombre: user.displayName || null,
        });
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);