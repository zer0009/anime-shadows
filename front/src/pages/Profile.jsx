import React from 'react';
import useFetchUserData from '../hooks/useFetchUserData';
import HistoryList from '../components/HistoryList/HistoryList.jsx';
import FavoriteList from '../components/FavoriteList/FavoriteList.jsx';
import styles from './Profile.module.css';

const Profile = () => {
    const { userData, animeDetails } = useFetchUserData();

    if (!userData) {
        return <div>Loading...</div>;
    }

    console.log("animeDetails", userData.history)

    return (
        <div className={styles.profileContainer}>
            <h2>User Profile</h2>
            <div className={styles.userDetails}>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
            </div>
            <FavoriteList favorites={userData.favorites} />
        </div>
    );
};

export default Profile;
