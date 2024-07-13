import API from '../client';



export const fetchEpisodesByAnimeId = async (animeId) => {
    try {
        const response = await API.get(`/episodes/anime/${animeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};