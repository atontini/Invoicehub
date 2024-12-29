import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ProtectedLink from './ProtectedLink';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Categories from './Categories';
import Products from './Products';
import Users from './Users';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Navigation Bar */}
          <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="text-xl font-bold">Mokka Back-end Test</div>
              <div className="flex space-x-4">
                <ProtectedLink to="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </ProtectedLink>
                <ProtectedLink to="/login" className="hover:text-gray-300" invert>
                  Login
                </ProtectedLink>
                <ProtectedLink to="/logout" className="hover:text-gray-300">
                  Logout
                </ProtectedLink>
                <ProtectedLink to="/signup" className="hover:text-gray-300" invert>
                  Signup
                </ProtectedLink>
                <ProtectedLink to="/products" className="hover:text-gray-300">
                  Products
                </ProtectedLink>
                <ProtectedLink to="/categories" className="hover:text-gray-300">
                  Categories
                </ProtectedLink>
                <ProtectedLink to="/users" className="hover:text-gray-300">
                  Users
                </ProtectedLink>
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 text-gray-700 text-center py-4">
            <p>© 2025 Andrea Tontini. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
