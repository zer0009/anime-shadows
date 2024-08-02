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
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        className={styles.tabs}
        TabIndicatorProps={{ style: { backgroundColor: 'var(--highlight-color)' } }}
      >
        <Tab
          label={t('animeDetails.details')}
          className={`${styles.tab} ${value !== 0 ? styles.tabNotSelected : ''}`}
        />
        <Tab
          label={t('animeDetails.episodes')}
          className={`${styles.tab} ${value !== 1 ? styles.tabNotSelected : ''}`}
        />
      </Tabs>
      {value === 0 && (
        <Box className={styles.tabContent}>
          <div className={styles.detailsContainer}>
            <AnimeMainContent
              anime={anime}
              handleGenreClick={handleGenreClick}
              getScoreDisplayProps={getScoreDisplayProps}
              t={t}
            />
            <AnimeSidebar
              anime={anime}
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
              handleRateAnime={handleRateAnime}
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