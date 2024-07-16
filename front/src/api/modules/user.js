import API from '../client';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const fetchUserProfile = async () => {
    try {
        const response = await API.get('/user/profile', getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await API.post('/user/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await API.patch('/user/profile', userData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const saveAnimeToHistory = async (animeId) => {
    try {
        const response = await API.post(`/user/history/${animeId}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error saving anime ${animeId} to history:`, error);
        throw error;
    }
};

export const addFavorite = async (animeId) => {
    try {
        const response = await API.post(`/user/favorites/${animeId}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error adding favorite anime ${animeId}:`, error);
        throw error;
    }
};

export const removeFavorite = async (animeId) => {
    try {
        const response = await API.delete(`/user/favorites/${animeId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error removing favorite anime ${animeId}:`, error);
        throw error;
    }
};

export const fetchFavorites = async () => {
    try {
        const response = await API.get('/user/favorites', getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching favorite animes:', error);
        throw error;
    }
};
