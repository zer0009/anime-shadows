import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import StarScoreDisplay from '../StarScoreDisplay.jsx';
import styles from './AnimeSidebar.module.css';

const AnimeSidebar = ({ anime, isFavorite, handleFavoriteClick, handleRateAnime, t }) => {
  const airingYear = anime.airingDate ? new Date(anime.airingDate).getFullYear() : 'N/A';

  return (
    <div className={styles.animeSidebar}>
      <Box className={styles.animeImageContainer}>
        <LazyLoadImage
          src={anime.pictureUrl}
          alt={`Poster of ${anime.title}`}
          effect="blur"
          className={styles.animeImage}
          threshold={300}
          placeholderSrc="/path/to/placeholder-image.jpg"
        />
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
        <Typography variant="body2"><strong>{t('animeDetails.year')}:</strong> {airingYear}</Typography>
        <Typography variant="body2"><strong>{t('animeDetails.season')}:</strong> {anime.season?.name || 'N/A'}</Typography>
        <Typography variant="body2"><strong>{t('animeDetails.source')}:</strong> {anime.source || 'N/A'}</Typography>
        <Typography variant="body2"><strong>{t('animeDetails.studio')}:</strong> {anime.studio || 'N/A'}</Typography>
        <Typography variant="body2"><strong>{t('animeDetails.duration')}:</strong> {anime.duration ? `${anime.duration} دقيقة` : 'N/A'}</Typography>
      </Box>
    </div>
  );
};

export default AnimeSidebar;