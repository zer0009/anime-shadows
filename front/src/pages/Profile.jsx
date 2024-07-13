import React from 'react';
import useFetchUserData from '../hooks/useFetchUserData';
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
                <p><strong>UserName:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
            </div>
        </div>
    );
};

export default Profile;
