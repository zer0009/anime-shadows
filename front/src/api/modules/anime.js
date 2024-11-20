import API from '../client';
import getAuthHeaders from './authHeader';

export const fetchAnime = async (page = 1, limit = 25, query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false) => {
    try {
        const response = await API.get('/anime', {
            params: {
                page,
                limit,
                query,
                tags: JSON.stringify(tags), // Convert tags array to JSON string
                type,
                season,
                sort,
                popular,
                state,
                broadMatches
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAnimeById = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await API.get(`/anime/${id}`, config);
    return response.data;
};

export const fetchAnimeBySlug = async (slug) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };  
    try {
        const response = await API.get(`/anime/slug/${slug}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchAnime = async (query) => {
    try {
        const response = await API.get(`/anime/search?q=${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchTypes = async () => {
    try {
        const response = await API.get('/types');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchSeasons = async () => {
    try {
        const response = await API.get('/seasons');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPopularAnime = async (timeFrame = "all", page = 1, limit = 25) => {
    try {
        const response = await API.get(`/anime/popular/anime?timeFrame=${timeFrame}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchGenre = async () => {
    try {
        const response = await API.get('/genres');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchStates = async () => {
    try {
        const response = await API.get('/states');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEpisodesByAnimeId = async (animeId) => {
    try {
        const response = await API.get(`/episodes/anime/${animeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const rateAnime = async (animeId, userId, rating) => {
    try {
        const response = await API.post(`/anime/${animeId}/rate`, { userId, rating }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAnimesByTypeId = async (typeId) => {
    try {
        const response = await API.get(`/types/${typeId}/animes`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchMovies = async (page = 1, limit = 10) => {
    try {
        const response = await API.get(`/anime/movies?page=${page}&limit=${limit}`);
        const data = response.data;
        return Array.isArray(data.animes) ? data : { animes: [], totalPages: 1 };
    } catch (error) {
        return { animes: [], totalPages: 1 };
    }
};

// export const toggleEpisodeWatched = async (animeId, episodeNumber) => {
//   try {
//     const response = await API.post('/anime/toggleEpisodeWatched', { animeId, episodeNumber }, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error toggling episode watched status:', error);
//     throw error;
//   }
// };

// export const fetchViewingHistoryByAnimeId = async (animeId) => {
//   try {
//     const response = await API.get(`/user/${animeId}/viewingHistory`, getAuthHeaders());
//     console.log('response 1', response);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching viewing history for anime ID ${animeId}:`, error);
//     throw error;
//   }
// };

// export const markAsWatched = async (animeId, episodeId) => {
//   try {
//     const response = await API.post(`/anime/${animeId}/episodes/${episodeId}/watch`, {}, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error marking episode as watched:', error);
//     throw error;
//   }
// };

// export const markAsUnwatched = async (animeId, episodeId) => {
//   try {
//     const response = await API.post(`/anime/${animeId}/episodes/${episodeId}/unwatch`, {}, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error marking episode as unwatched:', error);
//     throw error;
//   }
// };

// export const getViewingHistory = async () => {
//   try {
//     const response = await API.get('/anime/viewingHistory', getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching viewing history:', error);
//     throw error;
//   }
// };

export const markAsWatched = async (animeId, episodeId) => {
  try {
    const response = await API.post('/anime/viewingHistory/watched', { animeId, episodeId }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsUnwatched = async (animeId, episodeId) => {
  try {
    const response = await API.post('/anime/viewingHistory/unwatched', { animeId, episodeId }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getViewingHistory = async (animeId) => {
  const response = await API.get(`/anime/viewingHistory/${animeId}`, getAuthHeaders());
  return response.data;
};

export const getMyAnimeList = async (animeId) => {
  const response = await API.get(`/anime/myAnimeList/${animeId}`);
  return response.data;
};