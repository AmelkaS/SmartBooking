import React, { useState } from 'react';
// import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert
} from '@mui/material';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('http://localhost:8000/api/token/', {
        username: email,
        password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem("role", user.role);
      setMessage('Zalogowano pomyślnie!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage('Nieprawidłowy login lub hasło.');
      } else {
        setMessage('Błąd logowania. Spróbuj ponownie.');
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Box component="form" onSubmit={handleLogin} width="100%">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Zaloguj się
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Nie masz konta?{' '}
          <Link href="/register" underline="hover">Zarejestruj się tutaj.</Link>
        </Typography>

        <TextField
          label="Login"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Hasło"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          Zapomniałeś hasła?{' '}
          <Link href="/reset" underline="hover">Przypomnij mi.</Link>
        </Typography> */}

        {message && (
          <Alert severity={message.includes('Zalogowano') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ backgroundColor: '#0b2c68', textTransform: 'none', fontWeight: 'bold' }}
        >
          Potwierdź
        </Button>
      </Box>
    </Container>
  );
}
