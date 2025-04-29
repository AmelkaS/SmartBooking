import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      console.error("Błąd pobierania użytkowników:", err);
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
      fetchUsers(); // odświeżanie listy
    } catch (err: any) {
      console.error("Błąd usuwania użytkownika:", err);
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
    <div>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
          ← Wróć
        </button>
      </div>
      <h2>Lista użytkowników</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>
              {user.first_name} {user.last_name} - {user.role}
            </a>
            <button
              onClick={() => deleteUser(user.id)}
              style={{ marginLeft: "1rem" }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>Odśwież listę</button>
    </div>
  );
}
