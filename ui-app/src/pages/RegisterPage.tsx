import React, { useState } from 'react';
import axios from 'axios';

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
      // Krok 1: rejestracja
      await axios.post('http://localhost:8000/api/register/', {
        email,
        password,
      });

      // Krok 2: automatyczne logowanie
      const loginResponse = await axios.post('http://localhost:8000/api/token/', {
        username: email,   // JWT używa 'username', nawet jeśli to email
        password: password,
      });

      const { access, refresh } = loginResponse.data;

      // Krok 3: zapisanie tokenów
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Krok 4: przekierowanie
      setMessage('Zarejestrowano i zalogowano pomyślnie!');
      setTimeout(() => {
        window.location.href = '/'; // np /dashboard
      }, 1000);

    } catch (error: any) {
      console.error('Błąd rejestracji/logowania:', error);
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Hasło:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      <label htmlFor="confirmPassword">Potwierdź hasło:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        minLength={8}
        required
      />

      {message && <p>{message}</p>}

      <button type="submit">Zarejestruj się</button>
    </form>
  );
}
