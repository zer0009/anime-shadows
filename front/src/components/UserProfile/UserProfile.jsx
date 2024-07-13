import React from 'react';
import useFetchUserData from '../../hooks/useFetchUserData';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const { userData, animeDetails } = useFetchUserData();

    if (!userData) {
        return <LoadingSpinner />;
    }

    const history = userData.history || [];
    const favorites = userData.favorites || [];
    const friends = userData.friends || [];
    const messages = userData.messages || [];

    return (
        <div className={styles.userProfile}>
            <h1>User Profile</h1>
            <h2>History</h2>
            {history.length > 0 ? (
                history.map((item, index) => {
                    const anime = animeDetails[item.anime];
                    return (
                        <div key={index} className={styles.historyItem}>
                            {anime ? (
                                <>
                                    <img src={`http://localhost:5000${anime.pictureUrl}`} alt={anime.title} className={styles.animePicture} />
                                    <div className={styles.animeDetails}>
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
