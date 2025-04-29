import React, { useState } from 'react';
import axios from 'axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password,
      });

      // Odbieramy tokeny
      const { access, refresh, user } = response.data;

      // Zapisujemy w localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem("role", user.role);
      setMessage('Zalogowano pomyślnie!');
      
      // Opcjonalnie chwilka oczekiwania
      setTimeout(() => {
        window.location.href = '/';  // po zalogowaniu np. na stronę główną
      }, 1000);

    } catch (error: any) {
      console.error('Błąd logowania:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Nieprawidłowy login lub hasło.');
      } else {
        setMessage('Błąd logowania. Spróbuj ponownie.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
        required
      />

      {message && <p className="message">{message}</p>}

      <button type="submit">Zaloguj się</button>
    </form>
  );
}
