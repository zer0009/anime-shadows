import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser } from '../api/modules/auth';
import { fetchUserProfile } from '../api/modules/user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile()
                .then(data => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Fetched user profile:', data); // Debug log
                    }
                    setUser(data);
                })
                .catch(error => {
                    // console.error('Error fetching user profile:', error);
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false); // Set loading to false after fetching
                });
        } else {
            setLoading(false); // Set loading to false if no token
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            if (process.env.NODE_ENV === 'development') {
                console.log('Login response:', response); // Add detailed logging
            }
            localStorage.setItem('token', response.token); 
            localStorage.setItem('user', JSON.stringify(response.user));
            // Ensure the token is correctly set
            if (process.env.NODE_ENV === 'development') {
                console.log('Logged in user:', response.user); // Debug log
            }
            setUser(response.user); // Ensure the user state is correctly set
            navigate('/');
        } catch (error) {
            throw error; // Throw the error so it can be caught in useAuthForm
        }
    };

    const register = async (credentials) => {
        try {
            const response = await registerUser(credentials);
            if (process.env.NODE_ENV === 'development') {
                console.log('Register response:', response); // Add detailed logging
            }
            localStorage.setItem('token', response.token); 
            localStorage.setItem('user', JSON.stringify(response.user));
            // Ensure the token is correctly set
            if (process.env.NODE_ENV === 'development') {
                console.log('Registered user:', response.user); // Debug log
            }
            setUser(response.user); // Ensure the user state is correctly set
            navigate('/login');
        } catch (error) {
            throw error; // Throw the error so it can be caught in useAuthForm
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (process.env.NODE_ENV === 'development') {
                console.log('User logged out'); // Debug log
            }
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};