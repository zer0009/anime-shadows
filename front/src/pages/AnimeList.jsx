import React from 'react';
import AnimeCard from '../components/AnimeCard/AnimeCard.jsx';
import useFetchAnimes from '../hooks/useFetchAnimes';
import styles from './AnimeList.module.css';

const AnimeList = () => {
    const { animeList, loading, error } = useFetchAnimes();

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.animeList}>
            {animeList.map(anime => (
                <AnimeCard key={anime._id} anime={anime} />
            ))}
        </div>
    );
};

export default AnimeList;
