import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './NavigationSection.module.css';

const NavigationSection = ({ episode, episodes, t }) => {
  const currentIndex = episodes.findIndex(ep => ep._id === episode._id);
  const prevEpisode = currentIndex > 0 ? `/episode/${episodes[currentIndex - 1]._id}` : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? `/episode/${episodes[currentIndex + 1]._id}` : null;
  const animePage = `/anime/${episode.anime._id}`;

  return (
    <Box className={styles.navigationSection}>
      {prevEpisode && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={prevEpisode}
          className={styles.navButton}
        >
          {t('episodePage.previousEpisode')}
        </Button>
      )}
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to={animePage}
        className={styles.navButton}
      >
        {t('episodePage.animePage')}
      </Button>
      {nextEpisode && (
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          component={Link}
          to={nextEpisode}
          className={styles.navButton}
        >
          {t('episodePage.nextEpisode')}
        </Button>
      )}
    </Box>
  );
};

export default NavigationSection;