import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ padding: '10px', background: '#f4f4f4' }}>
                    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                </nav>

                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
