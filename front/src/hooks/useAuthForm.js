import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useAuthForm = (initialState) => {
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    try {
      await login(values);
    } catch (error) {
      setError('Login failed');
    }
  };

  const handleRegister = async (values) => {
    try {
    console.log(values)
      await register(values);
    } catch (error) {
      setError('Registration failed');
    }
  };

  return { error, handleLogin, handleRegister };
};

export default useAuthForm;
