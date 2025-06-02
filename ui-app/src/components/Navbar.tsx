import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  console.log("Rola użytkownika:", role);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "#013571",
      color: "#ffffff",
      borderBottom: "1px solid #333",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>SmartBooking</span>
      <div style={{ display: "flex", gap: "1rem" }}>
        
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Strona główna</Link>
        {token && <Link to="/rooms" style={{ color: "#fff", textDecoration: "none" }}>Sale</Link>}
        {token && <Link to="/users" style={{ color: "#fff", textDecoration: "none" }}>Użytkownicy</Link>}
        {token && role === "ADMIN" && (
          <>
            <Link to="/rooms/create" style={{ color: "#fff", textDecoration: "none" }}>Dodaj salę</Link>
            <Link to="/users/create" style={{ color: "#fff", textDecoration: "none" }}>Dodaj użytkownika</Link>
          </>
        )}
        {token && (
          <>
          <Link to="/reservations/create" style={{ color: "#fff", textDecoration: "none" }}>Rezerwuj salę</Link>
          <Link to="/reservations" style={{ color: "#fff", textDecoration: "none" }}>Rezerwacje</Link>
          </>
        )}
                
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {!token ? (
          <>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Zaloguj</Link>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>Rejestracja</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Wyloguj
          </button>
        )}
      </div>
    </nav>
  );
}
