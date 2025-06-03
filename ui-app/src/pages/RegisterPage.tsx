import React, { useState } from 'react';
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

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Hasła muszą być identyczne.');
      return;
    }

    try {
      await axiosInstance.post('http://localhost:8000/api/register/', {
        email,
        password,
      });

      const loginResponse = await axiosInstance.post('http://localhost:8000/api/token/', {
        username: email,
        password,
      });

      const { access, refresh } = loginResponse.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setMessage('Zarejestrowano i zalogowano pomyślnie!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error: any) {
      if (error.response?.data?.email) {
        setMessage('Użytkownik z takim adresem email już istnieje.');
      } else if (error.response?.status === 401) {
        setMessage('Rejestracja zakończona, ale logowanie się nie powiodło.');
      } else {
        setMessage('Rejestracja nie powiodła się. Spróbuj ponownie.');
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Box component="form" onSubmit={handleSubmit} width="100%">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Zarejestruj się
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Masz już konto?{' '}
          <Link href="/login" underline="hover">Zaloguj się tutaj.</Link>
        </Typography>

        <TextField
          label="Email"
          type="email"
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

        <TextField
          label="Potwierdź hasło"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {message && (
          <Alert severity={message.includes('Zarejestrowano') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ backgroundColor: '#0b2c68', textTransform: 'none', fontWeight: 'bold' }}
        >
          Zarejestruj się
        </Button>
      </Box>
    </Container>
  );
}
