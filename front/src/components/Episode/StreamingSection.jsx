import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Button, IconButton, Tooltip, Typography, CircularProgress } from '@mui/material';
import ReactPlayer from 'react-player';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FlagIcon from '@mui/icons-material/Flag';
import styles from './StreamingSection.module.css';

const StreamingSection = ({ episode, episodes, selectedTab, handleTabChange, embedError, handleEmbedError, embedUrl, t }) => {
  const [loading, setLoading] = useState(true);

  const isReactPlayerSupported = (url) => ReactPlayer.canPlay(url);

  const renderVideoPlayer = (url) => {
    if (isReactPlayerSupported(url)) {
      return (
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
          onError={handleEmbedError}
          onReady={() => setLoading(false)}
          onStart={() => setLoading(false)}
          className={styles.videoPlayer}
        />
      );
    } else if (url.includes('dailymotion.com')) {
      // Use Dailymotion Player Embed
      const videoId = url.split('/').pop();
      return (
        <div className={styles.iframeContainer}>
          <iframe
            className={styles.iframe}
            src={`https://www.dailymotion.com/embed/video/${videoId}`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video Player"
            onLoad={() => setLoading(false)}
            onError={handleEmbedError}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.iframeContainer}>
          <iframe
            className={styles.iframe}
            src={url}
            frameBorder="0"
            allow="autoplay; fullscreen"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            title="Video Player"
            onLoad={() => setLoading(false)}
            onError={handleEmbedError}
          />
        </div>
      );
    }
  };

  const currentIndex = episodes.findIndex(ep => ep._id === episode._id);
  const prevEpisode = currentIndex > 0 ? `/episode/${episodes[currentIndex - 1].anime.slug}-الحلقة-${episodes[currentIndex - 1].number}` : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? `/episode/${episodes[currentIndex + 1].anime.slug}-الحلقة-${episodes[currentIndex + 1].number}` : null;
  const animePage = `/anime/${episode.anime.slug}`;

  return (
    <Box className={styles.streamingSection}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="server tabs"
        className={styles.serverTabs}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        classes={{ scrollButtons: styles.scrollButtons }}
      >
        {episode.streamingServers.map((server, index) => (
          <Tab key={index} label={`${server.serverName} - ${server.quality}`} className={styles.serverTab} />
        ))}
      </Tabs>
      <Paper className={styles.videoContainer}>
        {loading && (
          <Box className={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        )}
        {!embedError ? (
          renderVideoPlayer(embedUrl)
        ) : (
          <Button
            variant="contained"
            color="primary"
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.watchButton}
          >
            {t('episodePage.watchVideo')}
          </Button>
        )}
      </Paper>
      <Box className={styles.navigationButtons}>
        <Box className={styles.leftIcons}>
          {prevEpisode && (
            <Tooltip title={t('episodePage.previousEpisode')}>
              <Button component="a" href={prevEpisode} className={styles.navButton} startIcon={<SkipPreviousIcon />}>
                <Typography variant="button">{t('episodePage.previousEpisode')}</Typography>
              </Button>
            </Tooltip>
          )}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          component="a"
          href={animePage}
          className={styles.animePageButton}
        >
          {t('episodePage.animePage')}
        </Button>
        <Box className={styles.rightIcons}>
        {nextEpisode && (
          <Tooltip title={t('episodePage.nextEpisode')}>
            <Button component="a" href={nextEpisode} className={styles.navButton} endIcon={<SkipNextIcon />}>
              <Typography variant="button">{t('episodePage.nextEpisode')}</Typography>
              </Button>
            </Tooltip>
          )}
          <Tooltip title={t('episodePage.report')}>
            <IconButton component="a" href="#" className={styles.reportButton}>
              <FlagIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default StreamingSection;