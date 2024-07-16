import API from '../client';

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
    console.error('Error adding anime:', error);
    throw error;
  }
};

export const addEpisode = async (episodeData) => {
  const response = await API.post('/episodes', episodeData);
  return response.data;
};

export const addCategory = async (categoryData) => {
  const response = await API.post('/admin/category', categoryData);
  return response.data;
};

export const addType = async (typeData) => {
  const response = await API.post('/admin/type', typeData);
  return response.data;
};

export const addGenre = async (genreData) => {
  const response = await API.post('/admin/genre', genreData);
  return response.data;
};

export const editAnime = async (animeId, animeData) => {
  const response = await API.put(`/admin/anime/${animeId}`, animeData);
  return response.data;
};

export const editEpisode = async (episodeId, episodeData) => {
  const response = await API.put(`/admin/episode/${episodeId}`, episodeData);
  return response.data;
};

export const editCategory = async (categoryId, categoryData) => {
  const response = await API.put(`/admin/category/${categoryId}`, categoryData);
  return response.data;
};

export const editType = async (typeId, typeData) => {
  const response = await API.put(`/admin/type/${typeId}`, typeData);
  return response.data;
};

export const editGenre = async (genreId, genreData) => {
  const response = await API.put(`/admin/genre/${genreId}`, genreData);
  return response.data;
};

export const removeAnime = async (animeId) => {
  const response = await API.delete(`/admin/anime/${animeId}`);
  return response.data;
};

export const updateEpisode = async (episodeId, episodeData) => {
    try {
        const response = await API.put(`/episodes/${episodeId}`, episodeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating episode ID ${episodeId}:`, error);
        throw error;
    }
};