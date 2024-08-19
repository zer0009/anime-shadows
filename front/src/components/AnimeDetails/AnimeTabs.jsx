import React, { useState, useCallback } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AnimeSidebar from './AnimeSidebar.jsx';
import AnimeMainContent from './AnimeMainContent.jsx';
import AnimeEpisodes from './AnimeEpisodes.jsx';
import styles from './AnimeTabs.module.css';

const AnimeTabs = React.memo(({ anime, isFavorite, handleFavoriteClick, handleRateAnime, handleGenreClick, openModal, getScoreDisplayProps, t }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = useCallback((event, newIndex) => {
    setTabIndex(newIndex);
  }, []);

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
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
        );
      case 1:
        return (
          <Box className={styles.tabContent}>
            <AnimeEpisodes
              anime={anime}
              openModal={openModal}
              t={t}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={styles.tabsContainer}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        className={styles.tabs}
        TabIndicatorProps={{ style: { backgroundColor: 'var(--highlight-color)' } }}
      >
        <Tab
          label={t('animeDetails.details')}
          className={`${styles.tab} ${tabIndex !== 0 ? styles.tabNotSelected : ''}`}
        />
        <Tab
          label={t('animeDetails.episodes')}
          className={`${styles.tab} ${tabIndex !== 1 ? styles.tabNotSelected : ''}`}
        />
      </Tabs>
      {renderTabContent()}
    </Box>
  );
});

export default AnimeTabs;