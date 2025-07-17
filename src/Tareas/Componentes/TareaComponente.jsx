import { Paper, Stack, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export const TareaComponente = ({ tarea, onEliminar, onCompletar }) => {

  const navigate = useNavigate();
  const estaCompletada = tarea.estado === 'Completada';

  const utcStringToLocal = (fechaStr) => {
  return new Date(fechaStr.replace(' ', 'T') + 'Z');
}

const fechaLocalFormateada = utcStringToLocal(tarea.fechaCreacion).toLocaleString('es-AR', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
});

  return (
    <Paper
    elevation={2}
    style={{
    width: '300px',
    minHeight: '150px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }}
>
      <Stack spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{
            textDecoration: estaCompletada ? 'line-through' : 'none',
            color: estaCompletada ? 'gray' : 'text.primary',
            fontWeight: '600',
          }}
        >
          {tarea.descripcion || tarea.texto}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            Tipo: {tarea.tipo || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Fecha: {tarea.fechaCreacion
            ? utcStringToLocal(tarea.fechaCreacion).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
            })
            : 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Estado: {tarea.estado}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
        <IconButton
          aria-label="completar"
          onClick={() => onCompletar(tarea.id)}
          color={estaCompletada ? 'default' : 'success'}
          size="small"
        >
          <CheckCircleIcon />
        </IconButton>

        <IconButton
          aria-label="editar"
          onClick={() => navigate(`/modificar/${tarea.id}`, { state: { tarea } })}
          color="primary"
          disabled={estaCompletada}
          size="small"
        >
          <EditIcon />
        </IconButton>

        <IconButton
          aria-label="eliminar"
          onClick={() => onEliminar(tarea.id)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}