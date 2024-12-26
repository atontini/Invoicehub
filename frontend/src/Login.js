import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
                remember,
            });

            localStorage.setItem('access_token', response.data.access_token);
            alert('Login successful!');
            setError(null);
        } catch (err) {
            console.error('Login error:', err);
            setError('Please check your login details and try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        Remember Me
                    </label>
                </div>
                {error && (
                    <div style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
