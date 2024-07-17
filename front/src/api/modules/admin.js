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

export const editAnime = async (animeId, animeData, formData) => {
  const response = await API.put(`/anime/update/${animeId}`, animeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const editEpisode = async (episodeId, episodeData, formData) => {
  const response = await API.put(`/episode/${episodeId}`, episodeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};


export const editType = async (typeId, typeData) => {
  const response = await API.put(`/type/${typeId}`, typeData);
  return response.data;
};

export const editGenre = async (genreId, genreData) => {
  const response = await API.put(`/genre/${genreId}`, genreData);
  return response.data;
};

export const removeAnime = async (animeId, formData) => {
  const response = await API.delete(`/anime/${animeId}`,formData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const updateEpisode = async (episodeId, episodeData, formData) => {
    try {
            const response = await API.put(`/episodes/${episodeId}`, episodeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating episode ID ${episodeId}:`, error);
        throw error;
    }
};

export const deleteEpisode = async (episodeId, formData) => {
    try {
        await API.delete(`/episodes/${episodeId}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting episode ID ${episodeId}:`, error);
        throw error;
    }
};

export const deleteAnime = async (animeId) => {
    try {
        await API.delete(`/anime/${animeId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting anime ID ${animeId}:`, error);
        throw error;
    }
};