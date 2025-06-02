import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography
} from "@mui/material";

export default function Home() {
  const role = localStorage.getItem("role");

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Witamy w aplikacji SmartBooking
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Wybierz jedną z opcji:
        </Typography>

        <Stack spacing={2} mt={4} alignItems="center">
          <Button
            variant="contained"
            component={RouterLink}
            to="/users"
            sx={{ width: 250, backgroundColor: "#013571", '&:hover': { backgroundColor: "#012f60" } }}
          >
            Lista użytkowników
          </Button>

          <Button
            variant="contained"
            component={RouterLink}
            to="/rooms"
            sx={{ width: 250, backgroundColor: "#013571", '&:hover': { backgroundColor: "#012f60" } }}
          >
            Lista sal
          </Button>

          {role === "ADMIN" && (
            <>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/users/create"
                sx={{
                  width: 250,
                  color: "#013571",
                  borderColor: "#013571",
                  '&:hover': {
                    backgroundColor: "#f0f8ff",
                    borderColor: "#013571",
                  },
                }}
              >
                Dodaj użytkownika
              </Button>

              <Button
                variant="outlined"
                component={RouterLink}
                to="/rooms/create"
                sx={{
                  width: 250,
                  color: "#013571",
                  borderColor: "#013571",
                  '&:hover': {
                    backgroundColor: "#f0f8ff",
                    borderColor: "#013571",
                  },
                }}
              >
                Dodaj salę
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
