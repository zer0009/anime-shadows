import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = ({ score, userCount }) => {
  return (
    <Box className={styles.scoreContainer}>
      <Box className={styles.scoreDetails}>
        <Typography variant="h5" className={styles.scoreValue}>
          {score !== null && score !== undefined ? score.toFixed(2) : 'N/A'}
        </Typography>
        {userCount !== null && userCount !== undefined && (
          <Typography variant="body2" className={styles.userCount}>
            {userCount.toLocaleString()}
          </Typography>
        )}
      </Box>
      <Typography variant="h6" className={styles.scoreLabel}>MAL</Typography>
    </Box>
  );
};

export default ScoreDisplay;