import { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; 

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth(); 
  const navigate = useNavigate();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await login({ email: correo, password }); 
      navigate('/'); 
    } catch (err) {
      setError('Las credenciales son incorrectas');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
  <Container
    maxWidth="sm"
    sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
  >
    <Paper elevation={4} sx={{ padding: 4, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Iniciar Sesión
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          required
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/register')}>
          Registrarse
        </Button>
      </Box>
    </Paper>
  </Container>
);
}