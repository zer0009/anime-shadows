import API from '../client';
import getAuthHeaders from './authHeader';


export const fetchUserProfile = async () => {
    try {
        const response = await API.get('/user/profile', getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await API.post('/user/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await API.patch('/user/profile', userData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveAnimeToHistory = async (animeId) => {
    if (!animeId) {
      throw new Error('Anime ID is required');
    }
  
    try {
      const response = await API.post(`/user/history/${animeId}`,{}, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const addFavorite = async (animeId) => {
    try {
        const response = await API.post(`/user/favorites/${animeId}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeFavorite = async (animeId) => {
    try {
        const response = await API.delete(`/user/favorites/${animeId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFavorites = async () => {
    try {
        const response = await API.get('/user/favorites', getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};
