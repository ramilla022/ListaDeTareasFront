import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../Context/AuthContext';
import TareaComponente from '../Componentes/TareaComponente';

const API_URL = import.meta.env.VITE_PORT;

export default function TareasPage({ estadoFiltro = 'Pendiente' }) {
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const confirmarEliminar = (tarea) => {
    setTareaSeleccionada(tarea);
    setOpenConfirm(true);
  };

  const cancelarEliminar = () => {
    setOpenConfirm(false);
    setTareaSeleccionada(null);
  };

  const handleEliminarConfirmado = async () => {
    try {
      await axios.delete(`${API_URL}/api/tarea/eliminar/${tareaSeleccionada.id}`);
      setTareas((prev) => prev.filter((t) => t.id !== tareaSeleccionada.id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
    cancelarEliminar();
  };

  const handleCompletar = async (id) => {
    try {
      const tareaActual = tareas.find((t) => t.id === id);
      const nuevoEstado = tareaActual.estado === 'Pendiente' ? 'Completada' : 'Pendiente';

      const tareaActualizada = {
        ...tareaActual,
        estado: nuevoEstado,
      };

      await axios.put(`${API_URL}/api/tarea/modificar/${id}`, tareaActualizada);

      setTareas((prev) =>
        prev.map((t) => (t.id === id ? tareaActualizada : t))
      );
    } catch (error) {
      console.error('Error al completar tarea:', error);
    }
  };

  useEffect(() => {
    if (usuario?.uid) {
      axios
        .get(`${API_URL}/api/tarea/tareasUsuario/${usuario.uid}`)
        .then((res) => setTareas(res.data))
        .catch((err) => console.error('Error al obtener tareas:', err));
    }
  }, [usuario]);

  const tareasFiltradas = tareas.filter((t) => t.estado === estadoFiltro);

  return (
    <Container maxWidth="sm" sx={{ position: 'relative', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {estadoFiltro === 'Pendiente' ? 'Tareas Pendientes' : 'Tareas Completadas'}
        </Typography>

        {tareasFiltradas.length === 0 ? (
          <Typography variant="body1">No tienes tareas {estadoFiltro.toLowerCase()}.</Typography>
        ) : (
          tareasFiltradas.map((tarea) => (
            <TareaComponente
              key={tarea.id}
              tarea={tarea}
              onEliminar={() => confirmarEliminar(tarea)} 
              onCompletar={handleCompletar}
            />
          ))
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate('/crearTarea')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openConfirm} onClose={cancelarEliminar}>
        <DialogTitle>Confirmar eliminacion</DialogTitle>
        <DialogContent>
          ¿Estas seguro que queres eliminar la tarea "
          {tareaSeleccionada?.descripcion || tareaSeleccionada?.texto}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarEliminar}>Cancelar</Button>
          <Button onClick={handleEliminarConfirmado} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}