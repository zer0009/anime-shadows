import { useState, useEffect } from 'react';
import { fetchRecentEpisodes } from '../api/modules/episode'; // Import the correct function

const useFetchRecentEpisodes = (page = 1) => {
    const [recentEpisodes, setRecentEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoading(true);
                const response = await fetchRecentEpisodes(page);
                setRecentEpisodes(response.episodes || []); // Ensure recentEpisodes is always an array
                setTotalPages(response.totalPages || 1); // Ensure totalPages is always a number
            } catch (error) {
                setError('Error fetching recent episodes');
                console.error('Error fetching recent episodes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [page]);

    return { recentEpisodes, loading, error, totalPages };
};

export default useFetchRecentEpisodes;