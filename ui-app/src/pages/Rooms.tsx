import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena. Zaloguj się.");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/rooms/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(res.data);
    } catch (err: any) {
      console.error("Błąd pobierania sal:", err);
      setError("Nie udało się pobrać sal.");
    }
  };

  const deleteRoom = async (id: number) => {
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Brak tokena. Zaloguj się.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/rooms/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRooms();
    } catch (err: any) {
      console.error("Błąd usuwania sali:", err);
      if (err.response?.status === 403) {
        setError("Brak uprawnień do usunięcia sali.");
      } else {
        setError("Nie udało się usunąć sali.");
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
          ← Wróć
        </button>
      </div>
      <h2>Lista sal</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <a href={`/rooms/${room.id}`}>
              {room.name} – {room.capacity} miejsc, {room.equipment}
            </a>
            <button onClick={() => deleteRoom(room.id)} style={{ marginLeft: "1rem" }}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
      <button onClick={fetchRooms}>Odśwież listę</button>
    </div>
  );
}
