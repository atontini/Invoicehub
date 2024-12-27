import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the user from localStorage or an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
          username,
          password,
        });

        console.log(response.status);
    
        if (response.status === 200) {
          const userData = response.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          console.log("login succesful");
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error.message || error);
        throw new Error('Invalid credentials or server error');
      }
    };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
