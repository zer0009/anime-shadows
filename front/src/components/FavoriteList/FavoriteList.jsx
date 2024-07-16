import React from 'react';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './FavoriteList.module.css';

const FavoriteList = ({ favorites }) => {
    return (
        <div className={styles.favoriteList}>
            <h3 className={styles.title}>Favorites</h3>
            {favorites.length > 0 ? (
                <div className={styles.animeGrid}>
                    {favorites.map(favorite => (
                        <AnimeCard key={favorite._id} anime={favorite} />
                    ))}
                </div>
            ) : (
                <p className={styles.noFavorites}>You have no favorite anime yet.</p>
            )}
        </div>
    );
};

export default FavoriteList;