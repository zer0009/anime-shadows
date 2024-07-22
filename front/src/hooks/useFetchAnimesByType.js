import { useState, useEffect } from 'react';
import { fetchAnimesByTypeId } from '../api/modules/anime';

const useFetchAnimesByType = (typeId) => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const data = await fetchAnimesByTypeId(typeId);
        setAnimes(data);
      } catch (error) {
        setError('Error fetching animes');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [typeId]);

  return { animes, loading, error };
};

export default useFetchAnimesByType;