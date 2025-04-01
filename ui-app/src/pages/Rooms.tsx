import React, { useEffect, useState } from "react";
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

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:8000/api/rooms/");
    setRooms(res.data);
  };

  return (
    <div>
      <h2>Lista sal</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <a href={`/rooms/${room.id}`}>
              {room.name} – {room.capacity} miejsc, {room.equipment}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={fetchRooms}>Odśwież listę</button>
    </div>
  );
}
