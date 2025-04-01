import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserForm() {
  const [form, setForm] = useState(
    { first_name: "", 
        last_name: "", 
        role: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
 
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/users/create/", form);
    alert("Użytkownik dodany!");
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
