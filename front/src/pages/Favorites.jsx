import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import { fetchFavorites } from '../api/modules/user';
import FavoriteList from '../components/FavoriteList/FavoriteList';
import styles from './Favorites.module.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFavorites = async () => {
            try {
                const response = await fetchFavorites();
                setFavorites(response);
            } catch (error) {
                setError('Error fetching favorite animes');
                console.error('Error fetching favorite animes:', error);
            } finally {
                setLoading(false);
            }
        };

        getFavorites();
    }, []);

    if (loading) {
        return <div className={styles.loading}><CircularProgress /></div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <Container className={styles.favoritesContainer}>
            <Typography variant="h4" className={styles.title}>My Favorite Animes</Typography>
            <FavoriteList favorites={favorites} />
        </Container>
    );
};

export default Favorites;
