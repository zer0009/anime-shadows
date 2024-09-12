import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAnime } from '../api/modules/anime';
import debounce from 'lodash.debounce';

const useFetchAnimeList = (initialPage = 1, initialLimit = 25) => {
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

    const debouncedFetchAnimeList = useMemo(() => debounce(fetchAnimeList, 300), [fetchAnimeList]);

    useEffect(() => {
        debouncedFetchAnimeList(currentPage, limit);
    }, [currentPage, limit, debouncedFetchAnimeList]);

    const handleSearch = useCallback(async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 25) => {
        try {
            setLoading(true);
            const response = await fetchAnime(page, limit, query, tags, type, season, sort, popular, state, broadMatches);
            const data = Array.isArray(response.animes) ? response.animes : [];
            setAnimeList(data); // Change this line
            setSearchResults(data);
            setTotalPages(response.totalPages);
            setCurrentPage(page);
        } catch (error) {
            setError('Error searching anime list');
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

    return useMemo(() => ({
        animeList,
        searchResults,
        loading,
        error,
        totalPages,
        handleSearch: debouncedHandleSearch,
        currentPage,
        setCurrentPage,
        limit,
        setLimit
    }), [animeList, searchResults, loading, error, totalPages, debouncedHandleSearch, currentPage, limit]);
};

export default useFetchAnimeList;