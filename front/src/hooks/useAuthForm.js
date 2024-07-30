import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useAuthForm = () => {
  const [error, setError] = useState(null);
  const { login, register } = useAuth();

  const handleLogin = async (values) => {
    try {
      await login(values);
      setError(null);
    } catch (err) {
      console.error('Error in handleLogin:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleRegister = async (values) => {
    try {
      await register(values);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error('Error in handleRegister:', err);
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        if (errorMessage.includes('duplicate key error')) {
          if (errorMessage.includes('username_1')) {
            setError('This username is already taken. Please choose a different one.');
          } else if (errorMessage.includes('email_1')) {
            setError('This email is already registered. Please use a different email or try logging in.');
          } else {
            setError('A user with this information already exists.');
          }
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      throw err; // Re-throw the error so it can be caught in the component
    }
  };

  return { error, handleLogin, handleRegister };
};

export default useAuthForm;