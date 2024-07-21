import API from '../client';

export const fetchEpisodesByAnimeId = async (animeId) => {
    try {
        const response = await API.get(`/episodes/anime/${animeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching episodes for anime ID ${animeId}:`, error);
        throw error;
    }
};

export const fetchEpisodeById = async (episodeId) => {
    try {
        const response = await API.get(`/episodes/${episodeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching episode ID ${episodeId}:`, error);
        throw error;
    }
};

export const fetchRecentEpisodes = async (page = 1, limit = 10) => {
    try {
        const response = await API.get('/episodes/recent', {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recent episodes:', error);
        throw error;
    }
};