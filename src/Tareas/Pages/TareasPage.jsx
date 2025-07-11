import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
import TareaComponente from '../Componentes/TareaComponente';
import { useTareas } from '../../Context/TareasContext';

const API_URL = import.meta.env.VITE_PORT;

export default function TareasPage({ estadoFiltro = 'Pendiente' }) {
  const [filtroTipo, setFiltroTipo] = useState('');
const [filtroFecha, setFiltroFecha] = useState('');
  const { tareas, loading, actualizarTarea, eliminarTarea, agregarEventoHistorial } = useTareas();
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
      agregarEventoHistorial(`La tarea "${tareaActual.descripcion}" cambió a estado "${nuevoEstado}"`);

    } catch (error) {
      console.error('Error al completar tarea:', error);
    }
  };

  const tareasFiltradas = tareas
  .filter((t) => t.estado === estadoFiltro)
  .filter((t) => (filtroTipo ? t.tipo === filtroTipo : true))

  .sort((a, b) => {
  if (filtroFecha === 'asc') {
    return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
  } else if (filtroFecha === 'desc') {
    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
  }
  return 0;
});

if (loading) {
  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      <CircularProgress />
    </Container>
  );
}

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
  <Container maxWidth="lg" sx={{ position: 'relative', mt: 5 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
  <Typography variant="h4" gutterBottom>
    {estadoFiltro === 'Pendiente' ? 'Tareas Pendientes' : 'Tareas Completadas'}
  </Typography>

  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel id="filtro-tipo-label">Filtrar por tipo</InputLabel>
    <Select
      labelId="filtro-tipo-label"
      value={filtroTipo}
      label="Filtrar por tipo"
      onChange={(e) => setFiltroTipo(e.target.value)}
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="Hogar">Hogar</MenuItem>
      <MenuItem value="Trabajo">Trabajo</MenuItem>
      <MenuItem value="Estudio">Estudio</MenuItem>
      <MenuItem value="Varias">Varias</MenuItem>
    </Select>
  </FormControl>

  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel id="filtro-fecha-label">Ordenar por fecha</InputLabel>
    <Select
      labelId="filtro-fecha-label"
      value={filtroFecha}
      label="Ordenar por fecha"
      onChange={(e) => setFiltroFecha(e.target.value)}
    >
      <MenuItem value="">Sin orden</MenuItem>
      <MenuItem value="asc">Más antiguas primero</MenuItem>
      <MenuItem value="desc">Más recientes primero</MenuItem>
    </Select>
  </FormControl>
</div>

  {tareasFiltradas.length === 0 ? (
    <Typography variant="body1">
      No tienes tareas {estadoFiltro.toLowerCase()}.
    </Typography>
  ) : (
    <div
    style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '8px',
    marginTop: '16px',
    justifyContent: 'flex-start',
  }}
>
      {tareasFiltradas.map((tarea) => (
        <TareaComponente
          key={tarea.id}
          tarea={tarea}
          onEliminar={() => confirmarEliminar(tarea)}
          onCompletar={handleCompletar}
        />
      ))}
    </div>
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
)
}