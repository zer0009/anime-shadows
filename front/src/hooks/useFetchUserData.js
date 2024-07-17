import { useState, useEffect } from 'react';
import API from '../api/client';

const useFetchUserData = () => {
    const [userData, setUserData] = useState(null);
    const [animeDetails, setAnimeDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
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
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchAnimeDetails = async (animeId) => {
            try {
                const response = await API.get(`/anime/${animeId}`);
                setAnimeDetails(prevDetails => ({
                    ...prevDetails,
                    [animeId]: response.data
                }));
            } catch (error) {
                console.error(`Error fetching anime details for ID ${animeId}:`, error);
                // Optionally, you can set a flag or message in animeDetails to indicate the error
                setAnimeDetails(prevDetails => ({
                    ...prevDetails,
                    [animeId]: { error: 'Error fetching details' }
                }));
            }
        };

        if (userData && userData.history) {
            userData.history.forEach(item => {
                if (item.anime && !animeDetails[item.anime]) {
                    fetchAnimeDetails(item.anime);
                }
            });
        }
    }, [userData]);

    return { userData, animeDetails, loading, error };
};

export default useFetchUserData;
