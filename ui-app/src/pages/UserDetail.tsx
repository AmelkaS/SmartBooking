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

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Brak tokena. Zaloguj się ponownie.");
          return;
        }

        const res = await axiosInstance.get(`http://localhost:8000/api/v1/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err: any) {
        console.error("Błąd pobierania użytkownika:", err);
        if (err.response?.status === 401) {
          setError("Nieautoryzowany dostęp.");
        } else if (err.response?.status === 403) {
          setError("Brak uprawnień do wyświetlania użytkownika.");
        } else {
          setError("Wystąpił błąd podczas pobierania danych użytkownika.");
        }
      }
    };

    fetchUser();
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
      ) : !user ? (
        <Typography>Ładowanie...</Typography>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rola: {user.role}
          </Typography>
        </>
      )}
    </Box>
  );
}
