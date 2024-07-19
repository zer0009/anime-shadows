import { useState, useEffect } from 'react';
import { fetchAnime, searchAnime, fetchPopularAnime } from '../api/modules/anime';

const useFetchAnimeList = (currentPage = 1) => {
    const [animeList, setAnimeList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const response = await fetchAnime(currentPage);
                const data = Array.isArray(response.animes) ? response.animes : [];
                setAnimeList(data);
                setSearchResults(data); // Initialize search results with the full list
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                setError('Error fetching anime list');
                console.error('Error fetching anime list:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeList();
    }, [currentPage]);

    const handleSearch = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false) => {
        try {
            setLoading(true);
            let results = animeList;

            if (query) {
                results = results.filter(anime =>
                    anime.title.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (tags.length > 0) {
                results = results.filter(anime => {
                    if (!anime.genres) {
                        return false;
                    }
                    const animeTagNames = anime.genres.map(tag => tag.name.toLowerCase());
                    return broadMatches
                        ? tags.some(tag => animeTagNames.includes(tag.toLowerCase()))
                        : tags.every(tag => animeTagNames.includes(tag.toLowerCase()));
                });
            }

            if (type) {
                results = results.filter(anime => anime.type && anime.type.name.toLowerCase() === type.toLowerCase());
            }

            if (season) {
                results = results.filter(anime => anime.season && anime.season.name.toLowerCase() === season.toLowerCase());
            }

            if (sort) {
                results = results.sort((a, b) => {
                    if (sort === 'title') {
                        return a.title.localeCompare(b.title);
                    } else if (sort === 'rating') {
                        return b.rating - a.rating;
                    } else if (sort === 'releaseDate') {
                        return new Date(b.releaseDate) - new Date(a.releaseDate);
                    }
                    return 0;
                });
            }

            if (popular) {
                const response = await fetchPopularAnime(popular);
                results = Array.isArray(response) ? response : [];
            }

            if (state) {
                results = results.filter(anime => anime.status && anime.status.toLowerCase() === state.toLowerCase());
            }

            setSearchResults(results);
        } catch (error) {
            setError('Error searching anime');
            console.error('Error searching anime:', error);
        } finally {
            setLoading(false);
        }
    };

    return { animeList, searchResults, loading, error, totalPages, handleSearch };
};

export default useFetchAnimeList;