import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [watchedEpisodes, setWatchedEpisodes] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
                setFavorites(response.data.favorites);
                setWatchedEpisodes(response.data.watchedEpisodes);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="user-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="favorites">
                <h3>Favorites</h3>
                <ul>
                    {favorites.map(favorite => (
                        <li key={favorite._id}>{favorite.title}</li>
                    ))}
                </ul>
            </div>
            <div className="watched-episodes">
                <h3>Watched Episodes</h3>
                <ul>
                    {watchedEpisodes.map(episode => (
                        <li key={episode._id}>{episode.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Profile;