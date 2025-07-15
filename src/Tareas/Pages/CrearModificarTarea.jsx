import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { FormularioTarea } from '../Componentes/FormTarea';
import { useTareas } from '../../Context/TareasContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORT;

export const CrearModificarTarea = ({ modo }) => {
  const { usuario } = useAuth();
  const { agregarTarea, actualizarTarea, agregarEventoHistorial } = useTareas();

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const esModificacion = modo === 'modificar';
  const tarea = state?.tarea;

  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('Hogar');
  const [estado, setEstado] = useState('Pendiente');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (esModificacion) {
      if (!tarea) {
        navigate('/');
        return;
      }
      setDescripcion(tarea.descripcion);
      setTipo(tarea.tipo);
      setEstado(tarea.estado);
      setFechaCreacion(tarea.fechaCreacion);
    } else {
      setFechaCreacion(new Date().toISOString().slice(0, 10));
    }
  }, [esModificacion, tarea, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (descripcion.trim() === '') {
      setError('La descripción es requerida');
      return;
    }

    if (esModificacion) {
      const tareaActualizada = { descripcion, tipo, estado, fechaCreacion };
      try {
        await axios.put(`${API_URL}/api/tarea/modificar/${id}`, tareaActualizada);
        actualizarTarea({ id, ...tareaActualizada });
        agregarEventoHistorial(`Tarea modificada: "${tareaActualizada.descripcion}"`);
        navigate('/');
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
      }
    } else {
      const nuevaTarea = {
        usuarioId: usuario?.uid,
        descripcion,
        tipo,
        estado,
        fechaCreacion,
      };
      try {
        const response = await axios.post(`${API_URL}/api/tarea/crear`, nuevaTarea);
        agregarTarea(response.data);
        navigate('/');
      } catch (error) {
        console.error('Error al crear tarea:', error);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {esModificacion ? 'Modificar Tarea' : 'Crear Nueva Tarea'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormularioTarea
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          tipo={tipo}
          setTipo={setTipo}
          estado={estado}
          fechaCreacion={fechaCreacion}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
          {esModificacion ? 'Guardar Cambios' : 'Crear Tarea'}
        </Button>
      </Box>
    </Container>
  );
};