import React from 'react';
import useAuthForm from '../hooks/useAuthForm';
import styles from './Auth.module.css';

const Register = () => {
    const { credentials, error, handleChange, handleRegister } = useAuthForm({ email: '', password: '' });

    return (
        <div className={styles.authContainer}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Register;
