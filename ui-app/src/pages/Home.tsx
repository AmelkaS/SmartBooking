import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const role = localStorage.getItem("role"); // 'ADMIN' lub 'USER'

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Witamy w aplikacji SmartBooking</h1>
      <p>Wybierz jedną z opcji:</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <Link to="/users">Lista użytkowników</Link>
        <Link to="/rooms">Lista sal</Link>
        {role === "ADMIN" && (
          <>
            <Link to="/users/create">Dodaj użytkownika</Link>
            <Link to="/rooms/create">Dodaj salę</Link>
          </>
        )}
      </div>
    </div>
  );
}

