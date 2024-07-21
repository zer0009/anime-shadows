import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = ({ score, userCount }) => {
  return (
    <Box className={styles.scoreContainer}>
      <Typography variant="h6" className={styles.scoreLabel}>MAL</Typography>
      <Box className={styles.scoreDetails}>
        <Typography variant="h5" className={styles.scoreValue}>{score.toFixed(2)}</Typography>
        <Typography variant="body2" className={styles.userCount}>{userCount.toLocaleString()} users</Typography>
      </Box>
    </Box>
  );
};

export default ScoreDisplay;