import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const API_URL = import.meta.env.VITE_PORT;

export default function TareasPage() {
  const { usuario } = useAuth(); 
  const [tareas, setTareas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    if (usuario?.uid) {
      axios
        .get(`${API_URL}/api/tarea/tareasUsuario/${usuario.uid}`)
        .then((res) => setTareas(res.data))
        .catch((err) => console.error('Error al obtener tareas:', err));
    }
  }, [usuario]);

  const toggleTarea = (id) => {
    const nuevasTareas = tareas.map((tarea) =>
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    setTareas(nuevasTareas);

  };

 return (
  <Container maxWidth="sm" sx={{ position: 'relative' }}>
    <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Mis Tareas
      </Typography>

      <List>
        {tareas.length === 0 && (
          <Typography variant="body1">No tienes tareas.</Typography>
        )}
        {tareas.map((tarea) => (
          <ListItem key={tarea.id} disablePadding>
            <ListItemText
              primary={tarea.descripcion || tarea.texto}
              sx={{
                textDecoration: tarea.completada ? 'line-through' : 'none',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>

    <Fab
      color="primary"
      aria-label="add"
      onClick={() => navigate('/crearTarea')}
      sx={{ position: 'fixed', bottom: 24, right: 24 }}
    >
      <AddIcon />
    </Fab>
  </Container>
)
}