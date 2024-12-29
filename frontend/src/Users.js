import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/`);
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Users</h2>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        {users.length > 0 ? (
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-6 py-4">ID</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">
            No users available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;
