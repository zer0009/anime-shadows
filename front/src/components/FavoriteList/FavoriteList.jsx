import React from 'react';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './FavoriteList.module.css';

const FavoriteList = ({ favorites }) => {
    return (
        <div className={styles.favoriteList}>
            <h3>Favorites</h3>
            <div className={styles.animeGrid}>
                {favorites.map(favorite => (
                    <AnimeCard key={favorite._id} anime={favorite} />
                ))}
            </div>
        </div>
    );
};

export default FavoriteList;