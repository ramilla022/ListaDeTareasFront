import { useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../Context/AuthContext';
import TareaComponente from '../Componentes/TareaComponente';
import { useTareas } from '../../Context/TareasContext';

const API_URL = import.meta.env.VITE_PORT;

export default function TareasPage({ estadoFiltro = 'Pendiente' }) {
  const { usuario } = useAuth();
  const { tareas, loading, actualizarTarea, eliminarTarea } = useTareas();
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
      eliminarTarea(tareaSeleccionada.id);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
    cancelarEliminar();
  };

  const handleCompletar = async (id) => {
    try {
      const tareaActual = tareas.find((t) => t.id === id);
      if (!tareaActual) return;

      const nuevoEstado = tareaActual.estado === 'Pendiente' ? 'Completada' : 'Pendiente';

      const tareaActualizada = {
        ...tareaActual,
        estado: nuevoEstado,
      };

      await axios.put(`${API_URL}/api/tarea/modificar/${id}`, tareaActualizada);

      actualizarTarea(tareaActualizada);
    } catch (error) {
      console.error('Error al completar tarea:', error);
      alert('Error al actualizar el estado de la tarea');
    }
  };

  const tareasFiltradas = tareas.filter((t) => t.estado === estadoFiltro);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ position: 'relative', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {estadoFiltro === 'Pendiente' ? 'Tareas Pendientes' : 'Tareas Completadas'}
        </Typography>

        {tareasFiltradas.length === 0 ? (
          <Typography variant="body1">
            No tienes tareas {estadoFiltro.toLowerCase()}.
          </Typography>
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
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que quieres eliminar la tarea "
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