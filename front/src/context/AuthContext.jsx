import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser } from '../api/modules/auth';
import { fetchUserProfile } from '../api/modules/user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
                    console.error('Error fetching user profile:', error);
                    localStorage.removeItem('token');
                });
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
            navigate('/profile');
        } catch (error) {
            console.error('Error logging in:', error);
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
            navigate('/profile');
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('token');
            if (process.env.NODE_ENV === 'development') {
                console.log('User logged out'); // Debug log
            }
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

