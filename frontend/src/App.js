import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Products from './Products';
import Categories from './Categories';
import Users from './Users';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ padding: '10px', background: '#f4f4f4' }}>
                    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                    <Link to="/signup" style={{ marginRight: '10px' }}>Signup</Link>
                    <Link to="/products" style={{ marginRight: '10px' }}>Products</Link>
                    <Link to="/categories" style={{ marginRight: '10px' }}>Categories</Link>
                    <Link to="/users" style={{ marginRight: '10px' }}>Users</Link>
                </nav>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
