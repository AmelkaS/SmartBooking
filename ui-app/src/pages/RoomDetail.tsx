import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/rooms/${id}/`).then((res) => {
      setRoom(res.data);
    });
  }, [id]);

  if (!room) return <div>Ładowanie...</div>;

  return (
    <div>
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem" }}>
                ← Wróć
            </button>
        </div>
        <h2>{room.name}</h2>
        <p>Pojemność: {room.capacity}</p>
        <p>Wyposażenie: {room.equipment}</p>
    </div>
  );
}
