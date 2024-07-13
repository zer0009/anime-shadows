import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecentEpisodes = () => {
    const [recentEpisodes, setRecentEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentEpisodes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/episodes/recent');
                setRecentEpisodes(response.data);
            } catch (error) {
                setError('Error fetching recent episodes');
                console.error('Error fetching recent episodes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentEpisodes();
    }, []);

    return { recentEpisodes, loading, error };
};

export default useFetchRecentEpisodes;