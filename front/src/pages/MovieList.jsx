import React from 'react';
import { CircularProgress, Typography, Grid } from '@mui/material';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import styles from './MovieList.module.css';

const MovieList = () => {
    const { animeList, loading, error } = useFetchAnimeList();

    // Filter the anime list to include only movies
    const movieList = animeList.filter(anime => anime.type && anime.type.name.toLowerCase() === 'movie');

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    return (
        <div className={styles.movieListPage}>
            <Typography variant="h4" component="h2" className={styles.pageTitle}>
                Movie List
            </Typography>
            <Grid container spacing={1} className={styles.movieGrid}>
                {movieList.length > 0 ? (
                    movieList.map(movie => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={movie._id}>
                            <AnimeCard anime={movie} />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" className={styles.noMoviesMessage}>
                        No movies found.
                    </Typography>
                )}
            </Grid>
        </div>
    );
}

export default MovieList;