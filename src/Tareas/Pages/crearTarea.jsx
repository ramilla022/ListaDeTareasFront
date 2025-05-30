import { useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Box } from '@mui/material';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_PORT;

export default function CrearTarea() {
  const { usuario } = useAuth();

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

    console.log('Tarea creada:', response.data);

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

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
            fullWidth
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            inputProps={{ maxLength: 40 }}
            helperText={`${descripcion.length}/100`}
            required
            margin="normal"
            multiline     
            sx={{ 
            textarea: { resize: 'vertical' }  
        }}/>

        <TextField
          select
          fullWidth
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          margin="normal"
        >
          <MenuItem value="Hogar">Hogar</MenuItem>
          <MenuItem value="Trabajo">Trabajo</MenuItem>
          <MenuItem value="Varias">Varias</MenuItem>
        </TextField>

        <TextField
          label="Estado"
          fullWidth
          value={estado}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Fecha de creación"
          fullWidth
          value={fechaCreacion}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
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