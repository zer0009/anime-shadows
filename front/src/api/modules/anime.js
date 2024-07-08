import API from '../client';

export const fetchAnime = () => API.get('/anime');
export const fetchAnimeById = (id) => API.get(`/anime/${id}`);
export const searchAnime = (query) => API.get(`/anime/search?q=${query}`);
export const fetchAnimeDetails = (id) => API.get(`/anime/${id}`);