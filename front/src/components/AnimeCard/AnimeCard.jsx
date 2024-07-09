import React from 'react';
import { Link } from 'react-router-dom';
import { CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import styles from './AnimeCard.module.css';

function AnimeCard({ anime, lastViewed, showLastViewed }) {
  if (!anime) {
    return <div>Loading...</div>;
  }

  // Add a cache-busting query parameter to the image URL
  const imageUrl = `http://localhost:5000${anime.pictureUrl}?t=${new Date().getTime()}`;

  return (
    <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
      <div className={styles.animeCard}>
        <CardMedia
          component="div"
          className={styles.cardCover}
          image={imageUrl}
          title={anime.title}
        >
          <Box className={`${styles.statusBadge} ${anime.status === 'completed' ? styles.statusBadgeCompleted : styles.statusBadgeOngoing}`}>
            {anime.status === 'completed' ? 'مكتمل' : 'يعرض الآن'}
          </Box>
          <IconButton className={styles.favoriteIcon}>
            <StarIcon />
          </IconButton>
        </CardMedia>
        <CardContent className={styles.cardContent}>
          <Typography variant="body2" className={styles.title}>
            {anime.title}
          </Typography>
          {showLastViewed && lastViewed && (
            <Typography variant="body2" className={styles.lastViewed}>
              Last viewed: {new Date(lastViewed).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </div>
    </Link>
  );
}

export default AnimeCard;
