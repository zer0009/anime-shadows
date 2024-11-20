import API from '../client';

export const fetchEpisodesByAnimeId = async (animeId) => {
    try {
        const response = await API.get(`/episodes/anime/${animeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEpisodeById = async (episodeId) => {
    try {
        const response = await API.get(`/episodes/${episodeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRecentEpisodes = async (page = 1, limit = 24) => {
    try {
        const response = await API.get(`/episodes/recent?page=${page}&limit=${limit}`);
        return response.data; // Ensure the correct data is returned
    } catch (error) {
        throw error;
    }
};

export const fetchEpisodeBySlugAndNumber = async (slug, episodeNumber) => {
    try {
        const response = await API.get(`/episodes`, {
            params: {
                slug,
                episodeNumber
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};