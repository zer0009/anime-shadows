import { useCallback, useMemo, useEffect, useState } from 'react';
import { fetchRecentEpisodes } from '../api/modules/episode'; // Import the correct function

const useFetchRecentEpisodes = (initialPage = 1, initialLimit = 24) => {
    const [recentEpisodes, setRecentEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const fetchEpisodes = useCallback(async (page, limit) => {
        try {
            setLoading(true);
            const response = await fetchRecentEpisodes(page, limit);
            const data = Array.isArray(response.episodes) ? response.episodes : [];
            setRecentEpisodes(data);
            setTotalPages(response.totalPages);
        } catch (error) {
            setError('Error fetching recent episodes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEpisodes(currentPage, limit);
    }, [currentPage, limit, fetchEpisodes]);

    return useMemo(() => ({
        recentEpisodes,
        loading,
        error,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        setLimit
    }), [recentEpisodes, loading, error, totalPages, currentPage, limit]);
};

export default useFetchRecentEpisodes;