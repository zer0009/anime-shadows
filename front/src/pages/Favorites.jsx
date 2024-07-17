import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import { fetchFavorites } from '../api/modules/user';
import FavoriteList from '../components/FavoriteList/FavoriteList';
import styles from './Favorites.module.css';
import useFetchUserData from '../hooks/useFetchUserData';

const Favorites = () => {
    const { userData, animeDetails, loading, error } = useFetchUserData();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState(null);

    useEffect(() => {
        const getFavorites = async () => {
            try {
                const response = await fetchFavorites();
                setFavorites(response);
            } catch (error) {
                setErrorFavorites('Error fetching favorite animes');
                console.error('Error fetching favorite animes:', error);
            } finally {
                setLoadingFavorites(false);
            }
        };

        getFavorites();
    }, []);

    if (loading || loadingFavorites) {
        return <div className={styles.loading}><CircularProgress /></div>;
    }

    if (error || errorFavorites) {
        return <div className={styles.error}>{error || errorFavorites}</div>;
    }

    const filteredFavorites = favorites.filter(animeId => animeDetails[animeId] && !animeDetails[animeId].error);

    return (
        <Container className={styles.favoritesContainer}>
            <Typography variant="h4" className={styles.title}>My Favorite Animes</Typography>
            <FavoriteList favorites={filteredFavorites} />
        </Container>
    );
};

export default Favorites;
