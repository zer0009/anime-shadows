import API from '../client';

export const fetchAnime = async () => {
    try {
        const response = await API.get('/anime');
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

export const fetchPopularAnime = async (timeFrame) => {
    try {
        const response = await API.get(`/anime/popular/anime?timeFrame=${timeFrame}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching popular anime for time frame ${timeFrame}:`, error);
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
