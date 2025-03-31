import React, { useState } from "react";
import axios from "axios";

export default function UserForm() {
  const [form, setForm] = useState(
    { first_name: "", 
        last_name: "", 
        role: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/users/create/", form);
    alert("Użytkownik dodany!");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
      <input name="first_name" placeholder="Imię" onChange={handleChange} />
      <input name="last_name" placeholder="Nazwisko" onChange={handleChange} />
      <input name="role" placeholder="Rola" onChange={handleChange} />
      <button type="submit">Dodaj</button>
    </form>
  );
}
