import React from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import styles from './StarScoreDisplay.module.css';

const StarScoreDisplay = ({ score, label }) => {
  return (
    <Box className={styles.scoreContainer}>
      <Star className={styles.starIcon} />
      <Box className={styles.scoreDetails}>
        <Typography variant="h6" className={styles.scoreValue}>{score.toFixed(2)}</Typography>
        {label && <Typography variant="body2" className={styles.scoreLabel}>{label}</Typography>}
      </Box>
    </Box>
  );
};

export default StarScoreDisplay;