import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FormularioTarea from '../Componentes/FormTarea';
import { Container, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { useTareas } from '../../Context/TareasContext';

const API_URL = import.meta.env.VITE_PORT;

export default function ModificarTarea() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { actualizarTarea, agregarEventoHistorial } = useTareas();

  const tarea = state?.tarea;

  const [descripcion, setDescripcion] = useState(tarea?.descripcion || '');
  const [tipo, setTipo] = useState(tarea?.tipo || 'Hogar');
  const [estado, setEstado] = useState(tarea?.estado || 'Pendiente');
  const [fechaCreacion, setFechaCreacion] = useState(tarea?.fechaCreacion || '');
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (descripcion.trim() === '') {
      setError('La descripción es requerida');
      return;
    }

    const tareaActualizada = {
      descripcion,
      tipo,
      estado,
      fechaCreacion,
    };

    try {
      await axios.put(`${API_URL}/api/tarea/modificar/${id}`, tareaActualizada);
       actualizarTarea({ id, ...tareaActualizada });
       agregarEventoHistorial(`Tarea modificada: "${tareaActualizada.descripcion}"`);

      navigate('/');
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

 useEffect(() => {
    if (!tarea) {
      navigate('/');
      return;
    }

    setDescripcion(tarea.descripcion);
    setTipo(tarea.tipo);
    setEstado(tarea.estado);
    setFechaCreacion(tarea.fechaCreacion);
  }, [tarea, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Modificar Tarea
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
          Guardar Cambios
        </Button>
      </Box>
    </Container>
  );
}