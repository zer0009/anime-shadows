import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAnime } from '../api/modules/anime';

const useFetchAnimeList = (initialPage = 1, initialLimit = 10) => {
    const [animeList, setAnimeList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const fetchAnimeList = useCallback(async (page, limit) => {
        try {
            setLoading(true);
            const response = await fetchAnime(page, limit);
            const data = Array.isArray(response.animes) ? response.animes : [];
            setAnimeList(data);
            setSearchResults(data);
            setTotalPages(response.totalPages);
        } catch (error) {
            setError('Error fetching anime list');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnimeList(currentPage, limit);
    }, [currentPage, limit, fetchAnimeList]);

    const handleSearch = useCallback(async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 10) => {
        try {
            setLoading(true);
            const response = await fetchAnime(page, limit, query, tags, type, season, sort, popular, state, broadMatches);
            const data = Array.isArray(response.animes) ? response.animes : [];
            setSearchResults(data);
            setTotalPages(response.totalPages);
            setCurrentPage(page);
        } catch (error) {
            setError('Error searching anime list');
        } finally {
            setLoading(false);
        }
    }, []);

    return useMemo(() => ({
        animeList,
        searchResults,
        loading,
        error,
        totalPages,
        handleSearch,
        currentPage,
        setCurrentPage,
        limit,
        setLimit
    }), [animeList, searchResults, loading, error, totalPages, handleSearch, currentPage, limit]);
};

export default useFetchAnimeList;