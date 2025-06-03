import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function UserForm() {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
        return;
      }

      await axiosInstance.post("http://localhost:8000/api/v1/users/create/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Użytkownik dodany!");
      navigate(-1);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Nieautoryzowany dostęp. Zaloguj się ponownie.");
      } else if (err.response?.status === 403) {
        setError("Brak uprawnień do dodawania użytkowników.");
      } else {
        setError("Wystąpił błąd przy dodawaniu użytkownika.");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          borderColor: "#013571",
          color: "#013571",
          "&:hover": { borderColor: "#013571", backgroundColor: "#f0f8ff" },
        }}
      >
        Wróć
      </Button>

      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Dodaj użytkownika
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Imię"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Nazwisko"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Rola"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 1,
            backgroundColor: "#013571",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#012f60" },
          }}
        >
          Dodaj
        </Button>
      </Box>
    </Box>
  );
}
