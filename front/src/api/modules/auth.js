import API from '../client'; // Ensure you have the correct path to your API setup

export const loginUser = async (credentials) => {
    try {
        const response = await API.post('/user/login', credentials);
        console.log('Login response:', response); // Add detailed logging
        return {
            token: response.data.token,
            user: {
                username: response.data.username,
                role: response.data.role,
            },
        };
    } catch (error) {
        console.error('Error in loginUser:', error); // Add error logging
        throw error; // Re-throw the error to be handled by the caller
    }
};

export const fetchUserProfile = () => {
    const token = localStorage.getItem('token');
    return API.get('/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const registerUser = (userData) => {
    return API.post('/user/register', userData);
};

export const updateUserProfile = (userData) => {
    const token = localStorage.getItem('token');
    return API.patch('/user/profile', userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const logoutUser = () => {
    const token = localStorage.getItem('token');
    return API.post('/user/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const saveAnimeToHistory = (animeId) => {
    const token = localStorage.getItem('token');
    return API.post(`/user/history/${animeId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
