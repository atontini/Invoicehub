import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ProtectedLink from './ProtectedLink';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Categories from './Categories';
import Products from './Products';
import Users from './Users';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <nav style={{ padding: '10px', background: '#f4f4f4' }}>
          <ProtectedLink to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</ProtectedLink>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/signup" style={{ marginRight: '10px' }}>Signup</Link>
          <ProtectedLink to="/products" style={{ marginRight: '10px' }}>Products</ProtectedLink>
          <ProtectedLink to="/categories" style={{ marginRight: '10px' }}>Categories</ProtectedLink>
          <ProtectedLink to="/users" style={{ marginRight: '10px' }}>Users</ProtectedLink>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
          <Route path="/categories" element={ <ProtectedRoute> <Categories /> </ProtectedRoute> } />
          <Route path="/products" element={ <ProtectedRoute> <Products /> </ProtectedRoute> } />
          <Route path="/users" element={ <ProtectedRoute> <Users /> </ProtectedRoute> } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
