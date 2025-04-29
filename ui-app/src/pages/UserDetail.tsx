import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Brak tokena. Zaloguj się ponownie.");
          return;
        }

        const res = await axios.get(`http://localhost:8000/api/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err: any) {
        console.error("Błąd pobierania użytkownika:", err);
        if (err.response?.status === 401) {
          setError("Nieautoryzowany dostęp.");
        } else if (err.response?.status === 403) {
          setError("Brak uprawnień do wyświetlania użytkownika.");
        } else {
          setError("Wystąpił błąd podczas pobierania danych użytkownika.");
        }
      }
    };

    fetchUser();
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div>Ładowanie...</div>;

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
          ← Wróć
        </button>
      </div>
      <h2>{user.first_name} {user.last_name}</h2>
      <p>Rola: {user.role}</p>
    </div>
  );
}
