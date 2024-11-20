import { useState, useEffect } from 'react';
import { fetchMovies } from '../api/modules/anime';

const useFetchMovieList = (currentPage = 1) => {
    const [movieList, setMovieList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMovieList = async () => {
            try {
                setLoading(true);
                const response = await fetchMovies(currentPage);
                const data = Array.isArray(response.animes) ? response.animes : [];
                setMovieList(data);
                setTotalPages(response.totalPages || 1);
            } catch (error) {
                setError('Error fetching movie list');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieList();
    }, [currentPage]);

    return { movieList, loading, error, totalPages };
};

export default useFetchMovieList;