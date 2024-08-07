import { useState, useEffect, useCallback } from 'react';
import API from '../api/client';

const useFetchUserData = () => {
    const [userData, setUserData] = useState(null);
    const [animeDetails, setAnimeDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await API.get('/user/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAnimeDetails = useCallback(async (animeId) => {
        try {
            const response = await API.get(`/anime/${animeId}`);
            setAnimeDetails(prevDetails => ({
                ...prevDetails,
                [animeId]: response.data
            }));
        } catch (error) {
            console.error(`Error fetching anime details for ID ${animeId}:`, error);
            setAnimeDetails(prevDetails => ({
                ...prevDetails,
                [animeId]: { error: 'Error fetching details' }
            }));
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        if (userData && userData.history) {
            userData.history.forEach(item => {
                if (item.anime && !animeDetails[item.anime]) {
                    fetchAnimeDetails(item.anime);
                }
            });
        }
    }, [userData, animeDetails, fetchAnimeDetails]);

    return { userData, animeDetails, loading, error };
};

export default useFetchUserData;