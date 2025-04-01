import React, { useState } from "react";
import axios from "axios";

export default function RoomForm() {
  const [form, setForm] = useState({
    name: "",
    capacity: 0,
    equipment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/rooms/create/", {
      ...form,
      capacity: Number(form.capacity),
    });
    alert("Sala dodana!");
  };

  return (
    <>
        <h3 style={{ textAlign: "center" }}>Dodaj nową salę</h3>
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
                name="name" 
                placeholder="Nazwa sali" 
                onChange={handleChange} 
                style={{ marginTop: "0.5rem", padding: "0.5rem" }}
            />
            <input
                name="capacity"
                type="number"
                placeholder="Pojemność"
                onChange={handleChange}
                style={{ marginTop: "0.5rem", padding: "0.5rem" }}
            />
            <input
                name="equipment"
                placeholder="Wyposażenie"
                onChange={handleChange}
                style={{ marginTop: "0.5rem", padding: "0.5rem" }}
            />
            <button type="submit">Dodaj salę</button>
        </form>
    </>
  );
}
