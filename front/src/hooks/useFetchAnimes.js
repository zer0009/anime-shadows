import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchAnimes = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/anime');
                setAnimeList(response.data);
            } catch (error) {
                setError('Error fetching animes');
                console.error('Error fetching animes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimes();
    }, []);

    return { animeList, loading, error };
};

export default useFetchAnimes;