import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import StarScoreDisplay from '../StarScoreDisplay.jsx';
import styles from './AnimeSidebar.module.css';
import { useTranslation } from 'react-i18next';

const AnimeSidebar = React.memo(({ anime, isFavorite, handleFavoriteClick, handleRateAnime }) => {
  const { t, i18n } = useTranslation();
  const airingYear = anime.airingDate ? new Date(anime.airingDate).getFullYear() : 'N/A';

  useEffect(() => {
    if (anime.pictureUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = anime.pictureUrl;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [anime.pictureUrl]);

  const renderMetaInfo = (label, value) => (
    <Typography variant="body2">
      <strong>{t(`animeDetails.${label}`)}:</strong> {value || 'N/A'}
    </Typography>
  );

  return (
    <div className={`${styles.animeSidebar} ${i18n.dir() === 'rtl' ? styles.rtl : styles.ltr}`}>
      <Box className={styles.animeImageContainer}>
        <LazyLoadImage
          src={anime.pictureUrl}
          alt={`Poster of ${anime.title}`}
          effect="blur"
          className={styles.animeImage}
          threshold={300}
          placeholderSrc="/path/to/placeholder-image.jpg"
          width={300}
          height={420}
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
        {renderMetaInfo('status', anime.status)}
        {renderMetaInfo('type', anime.type?.name)}
        {renderMetaInfo('year', airingYear)}
        {renderMetaInfo('season', anime.season?.name)}
        {renderMetaInfo('source', anime.source)}
        {renderMetaInfo('studio', anime.studio)}
        {renderMetaInfo('duration', anime.duration ? `${anime.duration} ${t('animeDetails.minutes')}` : 'N/A')}
      </Box>
    </div>
  );
});

export default AnimeSidebar;