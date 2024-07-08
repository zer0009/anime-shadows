import React, { useEffect, useState } from 'react';
import API from '../api/client'; // Ensure you have the correct path to your API setup

const UserProfile = () => {
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

    if (!userData) {
        return <div>Loading...</div>;
    }

    // Ensure userData properties are defined before using them
    const history = userData.history || [];
    const favorites = userData.favorites || [];
    const friends = userData.friends || [];
    const messages = userData.messages || [];

    return (
        <div>
            <h1>User Profile</h1>
            <h2>History</h2>
            {history.length > 0 ? (
                history.map((item, index) => {
                    const anime = animeDetails[item.anime];
                    return (
                        <div key={index} className="history-item">
                            {anime ? (
                                <>
                                    <img src={`http://localhost:5000${anime.pictureUrl}`} alt={anime.title} className="anime-picture" />
                                    <div className="anime-details">
                                        <p>Title: {anime.title}</p>
                                        <p>Last Viewed: {new Date(item.views[item.views.length - 1]).toLocaleString()}</p>
                                    </div>
                                </>
                            ) : (
                                <p>Loading anime details...</p>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>No history available</p>
            )}
            <h2>Favorites</h2>
            {favorites.length > 0 ? (
                favorites.map((item, index) => (
                    <div key={index}>
                        <p>{item.title}</p>
                    </div>
                ))
            ) : (
                <p>No favorites available</p>
            )}
            <h2>Friends</h2>
            {friends.length > 0 ? (
                friends.map((friend, index) => (
                    <div key={index}>
                        <p>{friend.username}</p>
                    </div>
                ))
            ) : (
                <p>No friends available</p>
            )}
            <h2>Messages</h2>
            {messages.length > 0 ? (
                messages.map((message, index) => (
                    <div key={index}>
                        <p>{message.content}</p>
                    </div>
                ))
            ) : (
                <p>No messages available</p>
            )}
        </div>
    );
};

export default UserProfile;
