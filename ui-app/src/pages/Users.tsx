import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Brak tokena. Zaloguj się ponownie.");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Nieautoryzowany dostęp. Zaloguj się.");
      } else {
        setError("Nie udało się pobrać użytkowników.");
      }
    }
  };

  const deleteUser = async (id: number) => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Brak tokena. Zaloguj się ponownie.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/users/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Nie masz uprawnień do usunięcia użytkownika.");
      } else {
        setError("Wystąpił błąd podczas usuwania użytkownika.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
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
        Lista użytkowników
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <List>
        {users.map((user: any) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => deleteUser(user.id)}
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
                  href={`/users/${user.id}`}
                  style={{ textDecoration: "none", color: "#013571" }}
                >
                  {user.first_name} {user.last_name} – {user.role}
                </a>
              }
              sx={{ ml: 2, pr: 4 }}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        onClick={fetchUsers}
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
