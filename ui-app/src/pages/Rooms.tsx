import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena. Zaloguj się.");
        return;
      }

      const res = await axiosInstance.get("http://localhost:8000/api/rooms/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(res.data);
    } catch (err: any) {
      console.error("Błąd pobierania sal:", err);
      setError("Nie udało się pobrać sal.");
    }
  };

  const deleteRoom = async (id: number) => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena. Zaloguj się.");
        return;
      }

      await axiosInstance.delete(`http://localhost:8000/api/rooms/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRooms();
    } catch (err: any) {
      console.error("Błąd usuwania sali:", err);
      if (err.response?.status === 403) {
        setError("Brak uprawnień do usunięcia sali.");
      } else {
        setError("Nie udało się usunąć sali.");
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
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

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lista sal lekcyjnych 
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <List>
        {rooms.map((room) => (
          <ListItem
            key={room.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => deleteRoom(room.id)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemText
              primary={
                <a
                  href={`/rooms/${room.id}`}
                  style={{ textDecoration: "none", color: "#013571" }}
                >
                  {room.name} – {room.capacity} miejsc, {room.equipment}
                </a>
              }
              sx={{ ml: 2, pr: 4 }}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        onClick={fetchRooms}
        sx={{
          mt: 3,
          backgroundColor: "#013571",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#012f60" },
        }}
      >
        Odśwież listę
      </Button>
    </Box>
  );
}
