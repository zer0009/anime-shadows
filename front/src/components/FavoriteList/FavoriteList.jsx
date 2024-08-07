import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './FavoriteList.module.css';

const FavoriteList = ({ favorites }) => {
    return (
        <Box className={styles.favoriteList}>
            {favorites.length > 0 ? (
                <Grid container spacing={2} className={styles.animeGrid}>
                    {favorites.map(favorite => (
                        <Grid item key={favorite._id} xs={12} sm={6} md={4} lg={2.4}>
                            <AnimeCard anime={favorite} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" className={styles.noFavorites}>
                    You have no favorite anime yet.
                </Typography>
            )}
        </Box>
    );
};

export default FavoriteList;