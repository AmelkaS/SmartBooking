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

export default function RoomForm() {
  const [form, setForm] = useState({
    name: "",
    capacity: 0,
    equipment: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena. Zaloguj się ponownie.");
        return;
      }

      await axiosInstance.post(
        "http://localhost:8000/api/v1/rooms/create/",
        {
          ...form,
          capacity: Number(form.capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Sala dodana!");
      navigate(-1);
    } catch (err: any) {
      console.error("Błąd dodawania sali:", err);
      if (err.response?.status === 403) {
        setError("Brak uprawnień do dodawania sal.");
      } else {
        setError("Nie udało się dodać sali.");
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
        Dodaj nową salę
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nazwa sali"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Pojemność"
          name="capacity"
          type="number"
          value={form.capacity}
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
          Dodaj salę
        </Button>
      </Box>
    </Box>
  );
}
