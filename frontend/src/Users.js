import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
  
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/`);
        setUsers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch users");
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    return (
      <div>
        <h2>Users</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  export default Users;