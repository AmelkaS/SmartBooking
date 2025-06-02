import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Grid,
  Chip,
} from "@mui/material";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("user_role");
      setUserRole(role || "");

      const response = await axios.get("http://localhost:8000/api/reservations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
    } catch (err) {
      setError("Nie udało się pobrać rezerwacji.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: number, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:8000/api/reservations/${id}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations();
    } catch {
      setError("Nie udało się zaktualizować statusu.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>Lista rezerwacji</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {reservations.map((res: any) => (
        <Paper key={res.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Sala:</strong> {res.room_name}</Typography>
              <Typography><strong>Studentów:</strong> {res.student_count}</Typography>
              <Typography><strong>Od:</strong> {res.start_time}</Typography>
              <Typography><strong>Do:</strong> {res.end_time}</Typography>
              <Typography><strong>Użytkownik:</strong> {res.user_email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Status:</strong> 
                <Chip
                  label={res.status}
                  color={
                    res.status === "APPROVED"
                      ? "success"
                      : res.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                  sx={{ ml: 1 }}
                />
              </Typography>
              {userRole === "ADMIN" && res.status === "PENDING" && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusChange(res.id, "APPROVED")}
                    sx={{ mr: 1 }}
                  >
                    Zatwierdź
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusChange(res.id, "REJECTED")}
                  >
                    Odrzuć
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}
