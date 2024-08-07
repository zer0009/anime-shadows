import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ScoreDisplay from '../ScoreDisplay.jsx';
import styles from './AnimeMainContent.module.css';

const AnimeMainContent = React.memo(({ anime, handleGenreClick, getScoreDisplayProps, t }) => {
  const { i18n } = useTranslation();

  const getGenreName = (genre) => {
    const currentLanguage = i18n.language;
    if (currentLanguage === 'ar' && genre.name_ar && genre.name_ar !== 'N/A') {
      return genre.name_ar;
    }
    return genre.name;
  };

  return (
    <div className={styles.mainContent}>
      <Box className={styles.scoreSection}>
        <ScoreDisplay {...getScoreDisplayProps(anime)} />
      </Box>
      <Box className={styles.titleAndScores}>
        <Typography variant="h5" className={styles.animeTitle}>{anime.title}</Typography>
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
            {getGenreName(genre)}
          </Button>
        ))}
      </Box>
    </div>
  );
});

export default AnimeMainContent;