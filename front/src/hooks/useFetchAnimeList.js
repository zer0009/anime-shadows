import { useState, useEffect } from 'react';
import { fetchAnime } from '../api/modules/anime';

const useFetchAnimeList = (initialPage = 1, initialLimit = 10) => {
    const [animeList, setAnimeList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                setLoading(true);
                const response = await fetchAnime(currentPage, limit); // Fetch data with pagination
                const data = Array.isArray(response.animes) ? response.animes : [];
                setAnimeList(data);
                setSearchResults(data); // Initialize search results with the full list
                setTotalPages(response.totalPages);
                console.log('Fetched anime list:', data);
            } catch (error) {
                setError('Error fetching anime list');
                console.error('Error fetching anime list:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeList();
    }, [currentPage, limit]);

    const handleSearch = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 10) => {
        try {
            setLoading(true);
            const response = await fetchAnime(page, limit, query, tags, type, season, sort, popular, state, broadMatches);
            const data = Array.isArray(response.animes) ? response.animes : [];
            setSearchResults(data);
            setTotalPages(response.totalPages);
            setCurrentPage(page);
        } catch (error) {
            setError('Error searching anime list');
            console.error('Error searching anime list:', error);
        } finally {
            setLoading(false);
        }
    };

    return { animeList, searchResults, loading, error, totalPages, handleSearch, currentPage, setCurrentPage, limit, setLimit };
};

export default useFetchAnimeList;