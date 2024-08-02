import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './AnimeReviews.module.css';

const AnimeReviews = ({ anime, t }) => {
  return (
    <Box className={styles.animeReviews}>
      <Typography variant="h5">{t('animeDetails.reviews')}</Typography>
      <ul className={styles.reviewList}>
        {anime.reviews && anime.reviews.length > 0 ? (
          anime.reviews.map(review => (
            <li key={review._id} className={styles.reviewItem}>
              <Typography variant="body1">{review.content}</Typography>
              <Typography variant="body2" className={styles.reviewAuthor}>
                {t('animeDetails.by')} {review.author}
              </Typography>
            </li>
          ))
        ) : (
          <Typography>{t('animeDetails.noReviews')}</Typography>
        )}
      </ul>
    </Box>
  );
};

export default AnimeReviews;