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
        if (userData && userData.favorites) {
            setFavorites(userData.favorites);
            setLoadingFavorites(false);
        } else if (userData && !userData.favorites) {
            setErrorFavorites('No favorites found');
            setLoadingFavorites(false);
        }
    }, [userData]);

    if (loading || loadingFavorites) {
        return <div className={styles.loading}><CircularProgress /></div>;
    }

    if (error || errorFavorites) {
        return <div className={styles.error}>{error || errorFavorites}</div>;
    }

    const filteredFavorites = favorites.filter(favorite => animeDetails[favorite._id] && !animeDetails[favorite._id].error);

    return (
        <Container className={styles.favoritesContainer}>
            <Typography variant="h4" className={styles.title}>My Favorite Animes</Typography>
            <FavoriteList favorites={filteredFavorites} />
        </Container>
    );
};

export default Favorites;
