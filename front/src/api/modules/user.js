import API from '../client'; // Ensure you have the correct path to your API setup

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

export const saveAnimeToHistory = (animeId) => {
    const token = localStorage.getItem('token');
    return API.post(`/user/history/${animeId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
