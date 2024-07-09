import { useState, useEffect } from 'react';
import API from '../api/client';

const useFetchUserData = () => {
    const [userData, setUserData] = useState(null);
    const [animeDetails, setAnimeDetails] = useState({});

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
                console.error('Error fetching anime details:', error);
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

    return { userData, animeDetails };
};

export default useFetchUserData;