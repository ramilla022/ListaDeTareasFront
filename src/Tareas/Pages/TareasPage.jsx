import { useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
} from '@mui/material';

export default function TareasPage() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Estudiar React', completada: false },
    { id: 2, texto: 'Preparar presentación', completada: true },
    { id: 3, texto: 'Revisar pendientes', completada: false },
  ]);

  const toggleTarea = (id) => {
    const nuevasTareas = tareas.map((tarea) =>
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    setTareas(nuevasTareas);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Mis Tareas
        </Typography>

        <List>
          {tareas.map((tarea) => (
            <ListItem key={tarea.id} disablePadding>
              <Checkbox
                checked={tarea.completada}
                onChange={() => toggleTarea(tarea.id)}
              />
              <ListItemText
                primary={tarea.texto}
                sx={{
                  textDecoration: tarea.completada ? 'line-through' : 'none',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}