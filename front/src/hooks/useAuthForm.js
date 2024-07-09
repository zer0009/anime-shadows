import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useAuthForm = (initialState) => {
    const { login, register } = useAuth();
    const [credentials, setCredentials] = useState(initialState);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
        } catch (error) {
            setError('Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(credentials);
        } catch (error) {
            setError('Registration failed');
        }
    };

    return { credentials, error, handleChange, handleLogin, handleRegister };
};

export default useAuthForm;