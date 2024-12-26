import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess(null);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password,
                email,
            });

            setSuccess('Registration successful! You can now log in.');
            setError(null);

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setEmail('');
        } catch (err) {
            console.error('Registration error:', err);
            setError('An error occurred during registration. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {error && (
                    <div style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ color: 'green', marginBottom: '15px' }}>
                        {success}
                    </div>
                )}
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Signup;
