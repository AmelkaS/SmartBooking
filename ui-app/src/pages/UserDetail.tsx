import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/${id}/`).then((res) => {
      setUser(res.data);
    });
  }, [id]);

  if (!user) return <div>Ładowanie...</div>;

  return (
    <div>
      <h2>{user.first_name} {user.last_name}</h2>
      <p>Rola: {user.role}</p>
    </div>
  );
}
