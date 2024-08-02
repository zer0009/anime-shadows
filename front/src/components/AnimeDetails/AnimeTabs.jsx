import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AnimeSidebar from './AnimeSidebar.jsx';
import AnimeMainContent from './AnimeMainContent.jsx';
import AnimeEpisodes from './AnimeEpisodes.jsx';
import styles from './AnimeTabs.module.css';

const AnimeTabs = ({ anime, isFavorite, handleFavoriteClick, handleRateAnime, handleGenreClick, openModal, getScoreDisplayProps, t }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.tabsContainer}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label={t('animeDetails.details')} />
        <Tab label={t('animeDetails.episodes')} />
      </Tabs>
      {value === 0 && (
        <Box className={styles.tabContent}>
          <div className={styles.detailsContainer}>
            <AnimeSidebar
              anime={anime}
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
              handleRateAnime={handleRateAnime}
              t={t}
            />
            <AnimeMainContent
              anime={anime}
              handleGenreClick={handleGenreClick}
              getScoreDisplayProps={getScoreDisplayProps}
              t={t}
            />
          </div>
        </Box>
      )}
      {value === 1 && (
        <Box className={styles.tabContent}>
          <AnimeEpisodes
            anime={anime}
            openModal={openModal}
            t={t}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnimeTabs;