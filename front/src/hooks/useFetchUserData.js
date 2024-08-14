import { useState, useEffect, useCallback, useRef } from 'react';
import API from '../api/client';

const useFetchUserData = () => {
    const [userData, setUserData] = useState(null);
    const [animeDetails, setAnimeDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchedAnimeIds = useRef(new Set()); // Use useRef to persist the set across renders

    const fetchUserData = useCallback(async () => {
        try {
            const response = await API.get('/user/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            setError('Error fetching user data');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAnimeDetailsBatch = useCallback(async (animeIds) => {
        try {
            const response = await API.post('/anime/batch', { ids: animeIds }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const newDetails = response.data.reduce((acc, anime) => {
                acc[anime._id] = anime;
                return acc;
            }, {});
            setAnimeDetails(prevDetails => ({
                ...prevDetails,
                ...newDetails
            }));
            // Add fetched IDs to the set
            animeIds.forEach(id => fetchedAnimeIds.current.add(id));
        } catch (error) {
            console.error('Error fetching anime details batch:', error); // Add logging
            animeIds.forEach(id => {
                setAnimeDetails(prevDetails => ({
                    ...prevDetails,
                    [id]: { error: 'Error fetching details' }
                }));
            });
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        if (userData && userData.history) {
            const animeIdsToFetch = userData.history
                .map(item => item.anime)
                .filter(animeId => animeId && !fetchedAnimeIds.current.has(animeId));

            if (animeIdsToFetch.length > 0) {
                fetchAnimeDetailsBatch(animeIdsToFetch);
            }
        }
    }, [userData, fetchAnimeDetailsBatch]);

    return { userData, animeDetails, loading, error };
};

export default useFetchUserData;