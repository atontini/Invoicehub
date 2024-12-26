import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ padding: '10px', background: '#f4f4f4' }}>
                    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                    <Link to="/signup" style={{ marginRight: '10px' }}>Signup</Link>
                </nav>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
