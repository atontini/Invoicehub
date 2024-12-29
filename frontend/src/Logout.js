import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Logout</h1>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
          <button
            onClick={() => navigate(-1)} // Navigate back
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
