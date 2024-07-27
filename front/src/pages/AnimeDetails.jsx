import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, rateAnime } from '../api/modules/anime';
import { addFavorite, removeFavorite } from '../api/modules/user';
import { Container, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StarScoreDisplay from '../components/StarScoreDisplay.jsx';
import ScoreDisplay from '../components/ScoreDisplay.jsx';
import styles from './AnimeDetails.module.css';

const AnimeDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const getAnimeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAnimeById(id);
      setAnime(response);
      const favoriteStatus = localStorage.getItem(`favorite-${id}`);
      setIsFavorite(favoriteStatus === 'true' || response.isFavorite || false);
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
  }, [id]);

  useEffect(() => {
    getAnimeDetails();
  }, [getAnimeDetails]);

  useEffect(() => {
    localStorage.setItem(`favorite-${id}`, isFavorite);
  }, [isFavorite, id]);

  const handleFavoriteClick = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login to favorite');
        return;
      }
      if (isFavorite) {
        await removeFavorite(anime._id);
      } else {
        await addFavorite(anime._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }, [isFavorite, anime]);

  const openModal = useCallback((episode) => {
    navigate(`/episode/${episode._id}`);
  }, [navigate]);

  const handleGenreClick = useCallback((genreId) => {
    navigate(`/filter/genre/${genreId}`);
  }, [navigate]);

  const handleRateAnime = useCallback(() => {
    setRatingDialogOpen(true);
  }, []);

  const submitRating = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login to rate');
        return;
      }
      await rateAnime(id, user._id, selectedRating);
      setUserRating(selectedRating);
      const updatedAnime = await fetchAnimeById(id);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error rating anime:', error);
    } finally {
      setRatingDialogOpen(false);
    }
  }, [id, selectedRating]);

  const removeRating = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login to remove rating');
        return;
      }
      await rateAnime(id, user._id, null);
      setUserRating(null);
      const updatedAnime = await fetchAnimeById(id);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error removing rating:', error);
    }
  }, [id]);

  const getScoreDisplayProps = useMemo(() => (anime) => ({
    score: anime.myAnimeListRating || 0,
    userCount: anime.myAnimeListUserCount || 0
  }), []);

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
      <Grid container spacing={4} className={`${styles.animeDetailsGrid} ${i18n.language === 'ar' ? styles.rtl : ''}`}>
        <Grid item xs={12} md={8}>
          <Box className={styles.titleAndScores}>
            <Typography variant="h4" className={styles.animeTitle}>{anime.title}</Typography>
            <Box className={styles.scoreSection}>
              <ScoreDisplay {...getScoreDisplayProps(anime)} />
            </Box>
          </Box>
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
            <Typography variant="h5">{t('animeDetails.episodes')}</Typography>
            <ul className={styles.episodeList}>
              {anime.episodes && anime.episodes.length > 0 ? (
                anime.episodes.map(episode => (
                  <li key={episode._id} className={styles.episodeItem} onClick={() => openModal(episode)}>
                    <Typography variant="body1">{episode.title}</Typography>
                  </li>
                ))
              ) : (
                <Typography>{t('animeDetails.noEpisodes')}</Typography>
              )}
            </ul>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={styles.animeSidebar}>
            <Box className={styles.animeImageContainer}>
              <img src={anime.pictureUrl} alt={anime.title} className={styles.animeImage} />
              <Box className={styles.scoreBadge}>
                <StarScoreDisplay score={anime.averageRating} />
              </Box>
            </Box>
            <Box className={styles.sidebarActions}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Star />}
                onClick={handleRateAnime}
                className={styles.rateButton}
              >
                {t('animeDetails.rate')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                onClick={handleFavoriteClick}
                className={styles.favoriteButton}
              >
                {t('animeDetails.favorite')}
              </Button>
            </Box>
            <Box className={styles.animeMeta}>
              <Typography variant="body2"><strong>{t('animeDetails.status')}:</strong> {anime.status || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.type')}:</strong> {anime.type?.name || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.year')}:</strong> {anime.airingDate?.year || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.season')}:</strong> {anime.season?.name || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.source')}:</strong> {anime.source || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.studio')}:</strong> {anime.studio || 'N/A'}</Typography>
              <Typography variant="body2"><strong>{t('animeDetails.duration')}:</strong> {anime.duration ? `${anime.duration} minutes` : 'N/A'}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Modal for rating anime */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>{t('animeDetails.rateAnime')}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Rating
              name="rating"
              value={selectedRating}
              max={10}
              precision={0.5}
              onChange={(event, newValue) => setSelectedRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#ff6d75',
                },
                '& .MuiRating-iconHover': {
                  color: '#ff3d47',
                },
              }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {selectedRating ? `${t('animeDetails.yourRating')}: ${selectedRating}` : t('animeDetails.selectRating')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)} color="primary">
            {t('animeDetails.cancel')}
          </Button>
          <Button onClick={submitRating} color="primary">
            {t('animeDetails.submit')}
          </Button>
          {userRating !== null && (
            <Button onClick={removeRating} color="secondary">
              {t('animeDetails.removeRating')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnimeDetails;