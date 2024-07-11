import React from 'react';
import { CircularProgress, Typography, Grid } from '@mui/material';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { getCurrentSeason } from '../utils/getCurrentSeason';
import styles from './SeasonAnime.module.css';

const SeasonAnime = () => {
    const { animeList, loading, error } = useFetchAnimeList();
    const currentSeason = getCurrentSeason();

    // Filter the anime list to include only items from the current season
    const seasonAnimeList = animeList.filter(anime => anime.season && anime.season.name.toLowerCase() === currentSeason.toLowerCase());

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    return (
        <div className={styles.seasonAnimePage}>
            <Typography variant="h4" component="h2" className={styles.pageTitle}>
                {currentSeason} Anime
            </Typography>
            <Grid container spacing={1} className={styles.animeGrid}>
                {seasonAnimeList.length > 0 ? (
                    seasonAnimeList.map(anime => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={anime._id}>
                            <AnimeCard anime={anime} />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" className={styles.noAnimeMessage}>
                        No anime found for the current season.
                    </Typography>
                )}
            </Grid>
        </div>
    );
}

export default SeasonAnime;