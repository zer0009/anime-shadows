import API from '../client';
import getAuthHeaders from './authHeader';

export const addAnime = async (formData) => {
  try {
    const response = await API.post('/anime/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addEpisode = async (episodeData) => {
  const response = await API.post('/episodes', episodeData, getAuthHeaders());
  return response.data;
};

export const addType = async (typeData) => {
  const response = await API.post('/types', typeData, getAuthHeaders());
  return response.data;
};

export const addGenre = async (genreData) => {
  const response = await API.post('/genres', genreData, getAuthHeaders());
  return response.data;
};

export const addSeason = async (seasonData) => {
  const response = await API.post('/seasons', seasonData, getAuthHeaders());
  return response.data;
};


export const editAnime = async (animeId, animeData) => {
  const response = await API.put(`/anime/update/${animeId}`, animeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const editEpisode = async (episodeId, episodeData) => {
  const response = await API.put(`/episode/${episodeId}`, episodeData, getAuthHeaders());
  return response.data;
};


export const editType = async (typeId, typeData) => {
  const response = await API.put(`/types/${typeId}`, typeData, getAuthHeaders());
  return response.data;
};

export const editGenre = async (genreId, genreData) => {
  const response = await API.put(`/genres/${genreId}`, genreData, getAuthHeaders());
  return response.data;
};

export const editSeason = async (seasonId, seasonData) => {
  const response = await API.put(`/seasons/${seasonId}`, seasonData, getAuthHeaders());
  return response.data;
};

export const deleteGenre = async (genreId) => {
  const response = await API.delete(`/genres/${genreId}`, getAuthHeaders());
  return response.data;
};

export const deleteType = async (typeId) => {
  const response = await API.delete(`/types/${typeId}`, getAuthHeaders());
  return response.data;
};

export const deleteSeason = async (seasonId) => {
  const response = await API.delete(`/seasons/${seasonId}`, getAuthHeaders());
  return response.data;
};

export const updateEpisode = async (episodeId, episodeData) => {
    try {
        const response = await API.put(`/episodes/${episodeId}`, episodeData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteEpisode = async (episodeId) => {
    try {
        await API.delete(`/episodes/${episodeId}`, getAuthHeaders());
    } catch (error) {
        throw error;
    }
};

export const deleteAnime = async (animeId) => {
    try {
        await API.delete(`/anime/${animeId}`, getAuthHeaders());
    } catch (error) {
        throw error;
    }
};

export const fetchUsers = async () => {
    const response = await API.get('admin/users', getAuthHeaders());
    return response.data;
};


export const updateUserRole = async (userId, role) => {
    const response = await API.put(`admin/users/${userId}/role`, { role }, getAuthHeaders());
    return response.data;
};


export const scrapeAnime = async (url) => {
    const response = await API.post('/anime/scrape-mal', { url });
    return response;
};

// New function to scrape Witanime
export const scrapeWitanime = async (url) => {
  const response = await API.get(`/anime/scrape-witanime?url=${encodeURIComponent(url)}`);
  return response.data;
};

export const scrapeAnimeLuxe = async (url) => {
  const response = await API.get(`/anime/scrape-animeluxe?url=${encodeURIComponent(url)}`);
  return response.data;
};

export const scrapeGogoanime = async (url) => {
  const response = await API.get(`/anime/scrape-gogoanime?url=${encodeURIComponent(url)}`);
  return response.data;
};

