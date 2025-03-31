// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users/");
    setUsers(res.data);
  };

  return (
    <div>
      <h2>Lista użytkowników</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>
              {user.first_name} {user.last_name} - {user.role}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>Odśwież listę</button>
    </div>
  );
}
