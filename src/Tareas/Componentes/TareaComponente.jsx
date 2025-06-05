import { Paper, ListItemText, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export default function TareaComponente({ tarea, onEliminar, onCompletar }) {

  const navigate = useNavigate();
  const estaCompletada = tarea.estado === 'Completada';

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: estaCompletada ? '#f0f0f0' : 'white',
        borderLeft: estaCompletada ? '6px solid green' : '6px solid transparent',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ListItemText
          primary={tarea.descripcion || tarea.texto}
          sx={{
            textDecoration: estaCompletada ? 'line-through' : 'none',
            color: estaCompletada ? 'gray' : 'text.primary',
          }}
        />
        <div>
          <IconButton
            aria-label="completar"
            onClick={() => onCompletar(tarea.id)}
            color={estaCompletada ? "default" : "success"}
          >
            <CheckCircleIcon />
          </IconButton>

  
          <IconButton
          aria-label="editar"
          onClick={() => navigate(`/modificar/${tarea.id}`, { state: { tarea } })}
          color="primary"
          disabled={estaCompletada}
          >


          <EditIcon />
        </IconButton>
          <IconButton
            aria-label="eliminar"
            onClick={() => onEliminar(tarea.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </Stack>
    </Paper>
  );
}