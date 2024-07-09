import API from '../client';

export const fetchAnime = () => API.get('/anime');
export const fetchAnimeById = (id) => API.get(`/anime/${id}`);
export const searchAnime = (query) => API.get(`/anime/search?q=${query}`);
export const fetchTypes = () => API.get('/types');
export const fetchSeasons = () => API.get('/seasons');
export const fetchPopularAnime = (timeFrame) => API.get(`/anime/popular/anime?timeFrame=${timeFrame}`);