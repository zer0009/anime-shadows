import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEpisodeById, fetchEpisodesByAnimeId } from '../api/modules/episode'; // Assume you have these API functions
import { Typography, Box, Tabs, Tab, Paper, Button, List, ListItem, ListItemText } from '@mui/material';
import ReactPlayer from 'react-player';
import styles from './EpisodePage.module.css';

const EpisodePage = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    const getEpisodeDetails = async () => {
      try {
        const response = await fetchEpisodeById(episodeId);
        setEpisode(response);
      } catch (error) {
        console.error(`Error fetching episode details: ${error}`);
      }
    };

    const getEpisodes = async () => {
      try {
        console.log(episode?.anime);
        const response = await fetchEpisodesByAnimeId(episode?.anime._id);
        console.log(response);
        console.log(episode?.anime._id);
        setEpisodes(response);
      } catch (error) {
        console.error(`Error fetching episodes: ${error}`);
      }
    };

    getEpisodeDetails();
    getEpisodes();
  }, [episodeId, episode?.anime._id]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setEmbedError(false); // Reset embed error when changing tabs
  };

  const handleEmbedError = () => {
    setEmbedError(true);
  };


  const isReactPlayerSupported = (url) => {
    return ReactPlayer.canPlay(url);
  };

  if (!episode) {
    return <div>Loading...</div>;
  }

  if ((!episode.streamingServers || episode.streamingServers.length === 0) &&
      (!episode.downloadServers || episode.downloadServers.length === 0)) {
    return <div>No servers available for this episode.</div>;
  }

  const embedUrl = episode.streamingServers[selectedTab]?.url;
  console.log('Selected Server URL:', embedUrl); // Debugging

  return (
    <div className={styles.episodePage}>
      <Box className={styles.headerSection}>
        <Typography variant="h4" className={styles.animeTitle}>
          {episode.animeTitle}
        </Typography>
        <Typography variant="h6" className={styles.episodeNumber}>
          Episode {episode.number}
        </Typography>
      </Box>
      <Box className={styles.streamingSection}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="server tabs" className={styles.serverTabs}>
          {episode.streamingServers.map((server, index) => (
            <Tab key={index} label={`${server.serverName} - ${server.quality}`} className={styles.serverTab} />
          ))}
        </Tabs>
        <Paper className={styles.videoContainer}>
          {!embedError ? (
            isReactPlayerSupported(embedUrl) ? (
              <ReactPlayer
                url={embedUrl}
                controls={true}
                width="100%"
                height="500px"
                onError={handleEmbedError}
              />
            ) : (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, overflow: 'hidden' }}
                  frameBorder="0"
                  src={embedUrl}
                  allowFullScreen
                  title="Video Player"
                  onError={handleEmbedError}
                />
              </div>
            )
          ) : (
            <Button
              variant="contained"
              color="primary"
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Video
            </Button>
          )}
        </Paper>
      </Box>
      <Box className={styles.episodeListSection}>
        <Typography variant="h6" className={styles.episodeListTitle}>
          جميع حلقات الأنمي
        </Typography>
        <List className={styles.episodeList}>
          {episodes.map((ep) => (
            <ListItem key={ep._id} button component={Link} to={`/episode/${ep._id}`}>
              <ListItemText primary={`الحلقة ${ep.number}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box className={styles.downloadSection}>
        <Typography variant="h6" className={styles.downloadTitle}>
          تحميل الحلقة
        </Typography>
        {episode.downloadServers.map((server, index) => (
          <Button key={index} variant="contained" className={styles.downloadButton} href={server.url} download>
            تحميل {server.serverName} - {server.quality}
          </Button>
        ))}
      </Box>
    </div>
  );
};

export default EpisodePage;
