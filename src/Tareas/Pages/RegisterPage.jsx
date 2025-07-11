import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Debe tener al menos 6 caracteres';
    if (!confirmarPassword) newErrors.confirmarPassword = 'Confirma la contraseña';
    else if (password !== confirmarPassword) newErrors.confirmarPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      register({ nombre, email, password });
      setRegistroExitoso(true);

      setTimeout(() => {
      navigate('/login');
    }, 2000);
    }
  };

  return (
  <Container
    maxWidth="sm"
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Paper elevation={4} sx={{ padding: 4, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Registrarse
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre completo"
          fullWidth
          required
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          required
          margin="normal"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          error={Boolean(errors.confirmarPassword)}
          helperText={errors.confirmarPassword}
        />
        {registroExitoso && (
          <Typography variant="body1" sx={{ color: 'green', mb: 2 }}>
            Registro exitoso. Redirigiendo al login...
          </Typography>
)}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Crear Cuenta
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate('/login')} sx={{ mt: 1 }}>
          Ya tengo cuenta
        </Button>
      </Box>
    </Paper>
  </Container>
);
}