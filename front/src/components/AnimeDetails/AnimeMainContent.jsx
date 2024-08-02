import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ScoreDisplay from '../ScoreDisplay.jsx';
import styles from './AnimeMainContent.module.css';

const AnimeMainContent = ({ anime, handleGenreClick, getScoreDisplayProps, t }) => {
  return (
    <div className={styles.mainContent}>
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
    </div>
  );
};

export default AnimeMainContent;