import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserForm() {
  const [error, setError] = useState("");
  const [form, setForm] = useState(
    { first_name: "", 
        last_name: "", 
        role: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
        return;
      }

      await axios.post("http://localhost:8000/api/users/create/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Użytkownik dodany!");
      navigate(-1); // wróć do poprzedniej strony

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Nieautoryzowany dostęp. Zaloguj się ponownie.");
      } else if (err.response?.status === 403) {
        setError("Brak uprawnień do dodawania użytkowników.");
      } else {
        setError("Wystąpił błąd przy dodawaniu użytkownika.");
      }
    }
  };

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
            ← Wróć
        </button>
      </div>
      <h3 style={{ textAlign: "center" }}>Dodaj użytkownika</h3>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "1rem",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <input 
          name="first_name" 
          placeholder="Imię" 
          onChange={handleChange} 
          style={{ marginTop: "0.5rem", padding: "0.5rem" }}
        />
        <input 
          name="last_name" 
          placeholder="Nazwisko" 
          onChange={handleChange} 
          style={{ marginTop: "0.5rem", padding: "0.5rem" }}
        />
        <input 
          name="role" 
          placeholder="Rola" 
          onChange={handleChange} 
          style={{ marginTop: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit">Dodaj</button>
      </form>
    </>
  );
}
