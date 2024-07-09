// src/pages/Login.jsx
import React from 'react';
import useAuthForm from '../hooks/useAuthForm';
import styles from './Auth.module.css';

const Login = () => {
    const { credentials, error, handleChange, handleLogin } = useAuthForm({ email: '', password: '' });

    return (
        <div className={styles.authContainer}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;