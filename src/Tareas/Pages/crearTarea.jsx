import { useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Box } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormularioTarea from '../Componentes/FormTarea';
import { useTareas } from '../../Context/TareasContext';

const API_URL = import.meta.env.VITE_PORT;

export default function CrearTarea() {
  const { usuario } = useAuth();
 const { agregarTarea } = useTareas()
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('Hogar');
  const navigate = useNavigate();

  const fechaCreacion = new Date().toISOString().slice(0, 10);
  const estado = 'Pendiente';

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (descripcion.trim().length === 0) {
    alert('La descripción es requerida');
    return;
  }

  const nuevaTarea = {
    usuarioId: usuario?.uid,
    descripcion,
    tipo,
    estado,
    fechaCreacion,
  };

  try {
    const response = await axios.post(`${API_URL}/api/tarea/crear`, nuevaTarea);
    agregarTarea(response.data)

    setDescripcion('');
    setTipo('Hogar');

    navigate('/')

  } catch (error) {
    console.error('Error al crear tarea:', error);
    alert('Error al crear la tarea, intenta de nuevo');
  }
};

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nueva Tarea
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormularioTarea
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          tipo={tipo}
          setTipo={setTipo}
          estado={estado}
          fechaCreacion={fechaCreacion}
          handleSubmit={handleSubmit}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          fullWidth
        >
          Crear Tarea
        </Button>
        </Box>
    </Container>
  );
}