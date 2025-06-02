import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ReservationForm() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room: "",
    start_time: "",
    end_time: "",
    student_count: "",
  });
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/api/rooms/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch {
        setError("Błąd podczas pobierania sal.");
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/api/user/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role);
      } catch {
        setError("Nie udało się pobrać danych użytkownika.");
      }
    };

    fetchRooms();
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        ...form,
        status: userRole === "ADMIN" ? "APPROVED" : "PENDING",
      };

      await axios.post("http://localhost:8000/api/reservations/create/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Rezerwacja została zapisana.");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Nie udało się zapisać rezerwacji.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Formularz rezerwacji sali
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Sala"
          name="room"
          value={form.room}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {rooms.map((room: any) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Początek"
          name="start_time"
          type="datetime-local"
          value={form.start_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Koniec"
          name="end_time"
          type="datetime-local"
          value={form.end_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Liczba studentów"
          name="student_count"
          type="number"
          value={form.student_count}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Zarezerwuj
        </Button>
      </form>
    </Box>
  );
}
