import API from '../client';
import getAuthHeaders from './authHeader';

export const fetchAnime = async (page = 1, limit = 10, query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false) => {
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
        console.error('Error fetching anime:', error);
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

export const searchAnime = async (query) => {
    try {
        const response = await API.get(`/anime/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching anime with query ${query}:`, error);
        throw error;
    }
};

export const fetchTypes = async () => {
    try {
        const response = await API.get('/types');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching types:', error);
        throw error;
    }
};

export const fetchSeasons = async () => {
    try {
        const response = await API.get('/seasons');
        return response.data;
    } catch (error) {
        console.error('Error fetching seasons:', error);
        throw error;
    }
};

export const fetchPopularAnime = async (timeFrame="all", page = 1) => {
    try {
        const response = await API.get(`/anime/popular/anime?timeFrame=${timeFrame}&page=${page}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching popular anime for time frame ${timeFrame} on page ${page}:`, error);
        throw error;
    }
};

export const fetchGenre = async () => {
    try {
        const response = await API.get('/genres');
        return response.data;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};


export const fetchStates = async () => {
    try {
        const response = await API.get('/states');
        return response.data;
    } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
    }
};

export const fetchEpisodesByAnimeId = async (animeId) => {
    try {
        const response = await API.get(`/episodes/anime/${animeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching episodes for anime ID ${animeId}:`, error);
        throw error;
    }
};


export const rateAnime = async (animeId,userId, rating) => {
    try {
      const response = await API.post(`/anime/${animeId}/rate`, { userId, rating },getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error rating anime:', error);
      throw error;
    }
  };


  export const fetchAnimesByTypeId = async (typeId) => {
    try {
      const response = await API.get(`/types/${typeId}/animes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching animes by type ID:', error);
      throw error;
    }
  };


  export const fetchMovies = async (page = 1, limit = 10) => {
    try {
      const response = await API.get(`/anime/movies?page=${page}&limit=${limit}`);
      const data = response.data;
      console.log('data', data);
      return Array.isArray(data.animes) ? data : { animes: [], totalPages: 1 };
    } catch (error) {
      console.error('Error fetching movies:', error);
      return { animes: [], totalPages: 1 };
    }
  };