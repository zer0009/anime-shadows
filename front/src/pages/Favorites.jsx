import React, { useEffect, useState, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FavoriteList from '../components/FavoriteList/FavoriteList';
import styles from './Favorites.module.css';
import useFetchUserData from '../hooks/useFetchUserData';

const Favorites = () => {
    const { userData, animeDetails, loading, error } = useFetchUserData();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState(null);

    useEffect(() => {
        if (userData) {
            if (userData.favorites) {
                setFavorites(userData.favorites);
                setLoadingFavorites(false);
            } else {
                setErrorFavorites('No favorites found');
                setLoadingFavorites(false);
            }
        }
    }, [userData]);

    const filteredFavorites = useMemo(() => {
        return favorites.filter(favorite => animeDetails[favorite._id] && !animeDetails[favorite._id].error);
    }, [favorites, animeDetails]);

    if (loading || loadingFavorites) {
        return <LoadingSpinner />;
    }

    if (error || errorFavorites) {
        return <div className={styles.error}>{error || errorFavorites}</div>;
    }

    return (
        <Container className={styles.favoritesContainer}>
            <Typography variant="h4" className={styles.title}>My Favorite Animes</Typography>
            <FavoriteList favorites={filteredFavorites} />
        </Container>
    );
};

export default Favorites;