import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Button,
  Typography,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Brak tokena. Zaloguj się ponownie.");
          return;
        }

        const res = await axiosInstance.get(`http://localhost:8000/api/rooms/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoom(res.data);
      } catch (err: any) {
        console.error("Błąd pobierania sali:", err);
        setError("Nie udało się pobrać szczegółów sali.");
      }
    };

    fetchRoom();
  }, [id]);

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

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : !room ? (
        <Typography>Ładowanie...</Typography>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {room.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Pojemność: {room.capacity}
          </Typography>
        </>
      )}
    </Box>
  );
}
