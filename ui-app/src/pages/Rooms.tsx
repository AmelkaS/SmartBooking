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

  useEffect(() => {
    fetchRooms();
  }, []);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:8000/api/rooms/");
    setRooms(res.data);
  };

  const deleteRoom = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/rooms/${id}/delete/`);
      fetchRooms(); // odświeżanie listy
    } catch (err) {
      console.error("Błąd usuwania sali:", err);
    }
  };

  return (
    <div>
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
                ← Wróć
            </button>
        </div>
        <h2>Lista sal</h2>
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
