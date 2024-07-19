import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimeById, rateAnime } from '../api/modules/anime';
import { addFavorite, removeFavorite } from '../api/modules/user';
import { Container, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import styles from './AnimeDetails.module.css';

const AnimeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);

    useEffect(() => {
        const getAnimeDetails = async () => {
            try {
                const response = await fetchAnimeById(id);
                setAnime(response);
                const favoriteStatus = localStorage.getItem(`favorite-${id}`);
                setIsFavorite(favoriteStatus === 'true' || response.isFavorite || false);
                // Check if the user has already rated this anime
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && response.userRatings) {
                    const userRating = response.userRatings.find(r => r.userId === user._id);
                    if (userRating) {
                        setUserRating(userRating.rating);
                    }
                }
            } catch (error) {
                console.error('Error fetching anime details or saving to history:', error);
                setError('Error fetching anime details');
            } finally {
                setLoading(false);
            }
        };
        getAnimeDetails();
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`favorite-${id}`, isFavorite);
    }, [isFavorite, id]);

    const handleFavoriteClick = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login to favorite');
                return;
            }
            if (isFavorite) {
                await removeFavorite(anime._id);
                alert('Anime removed from favorites');
            } else {
                await addFavorite(anime._id);
                alert('Anime added to favorites');
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const openModal = (episode) => {
        navigate(`/episode/${episode._id}`);
    };

    const handleGenreClick = (genreId) => {
        navigate(`/filter/genre/${genreId}`);
    };

    const handleRateAnime = () => {
        setRatingDialogOpen(true);
    };

    const submitRating = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login to rate');
                return;
            }
            await rateAnime(id, user._id, selectedRating);
            setUserRating(selectedRating);
            // Update the anime details to reflect the new rating
            const updatedAnime = await fetchAnimeById(id);
            setAnime(updatedAnime);
            console.log('Anime rated successfully');
        } catch (error) {
            console.error('Error rating anime:', error);
        } finally {
            setRatingDialogOpen(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!anime) {
        return <Typography>No anime details found.</Typography>;
    }

    return (
        <Container maxWidth="lg" className={styles.animeDetailsContainer}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" className={styles.animeTitle}>{anime.title}</Typography>
                    <Typography variant="body1" className={styles.animeSubtitle}>{anime.description}</Typography>
                    <Box className={styles.animeTags}>
                        {anime.genres.map(genre => (
                            <Button
                                key={genre._id}
                                variant="outlined"
                                color="primary"
                                onClick={() => handleGenreClick(genre._id)}
                                className={styles.animeTag}
                            >
                                {genre.name}
                            </Button>
                        ))}
                    </Box>
                    <Box className={styles.animeEpisodes}>
                        <Typography variant="h5">Episodes List</Typography>
                        <ul className={styles.episodeList}>
                            {anime.episodes && anime.episodes.length > 0 ? (
                                anime.episodes.map(episode => (
                                    <li key={episode._id} className={styles.episodeItem} onClick={() => openModal(episode)}>
                                        <Typography variant="body1">{episode.title}</Typography>
                                    </li>
                                ))
                            ) : (
                                <Typography>No episodes available</Typography>
                            )}
                        </ul>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box className={styles.animeSidebar}>
                        <img src={`${import.meta.env.VITE_API_URL}${anime.pictureUrl}`} alt={anime.title} className={styles.animeImage} />
                        <Box className={styles.sidebarActions}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Star />}
                                onClick={handleRateAnime}
                                className={styles.rateButton}
                            >
                                Rate
                            </Button>
                            <IconButton onClick={handleFavoriteClick} className={styles.favoriteButton}>
                                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />} 
                                <Typography variant="body2"><strong>Favorites</strong></Typography>
                            </IconButton>
                        </Box>
                        <Box className={styles.animeMeta}>
                            <Typography variant="body2"><strong>Status:</strong> {anime.status || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Type:</strong> {anime.type?.name || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Year:</strong> {anime.airingDate?.year || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Season:</strong> {anime.season?.name || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Source:</strong> {anime.source || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Studio:</strong> {anime.studio || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Duration:</strong> {anime.duration ? `${anime.duration} minutes` : 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Modal for rating anime */}
            <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
                <DialogTitle>Rate Anime</DialogTitle>
                <DialogContent>
                    <Rating
                        name="rating"
                        value={selectedRating}
                        precision={0.5}
                        onChange={(event, newValue) => setSelectedRating(newValue)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRatingDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitRating} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AnimeDetails;
