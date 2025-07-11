import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}
        >
          <TaskAltIcon />
          App de Tareas
        </Typography>

        <Button color="inherit" startIcon={<ChecklistIcon />} component={NavLink} to="/">
          Tareas Pendientes
        </Button>
        <Button color="inherit" startIcon={<DoneAllIcon />} component={NavLink} to="/completadas">
          Tareas Completadas
        </Button>
        <Button color="inherit" startIcon={<ChecklistIcon />} component={NavLink} to="/historialTareas">
          Historial de tareas
        </Button>

        <Box sx={{ width: 20 }} />

        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  </Box>
);
}