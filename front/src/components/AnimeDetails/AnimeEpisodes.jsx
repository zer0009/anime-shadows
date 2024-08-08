import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { markAsWatched, markAsUnwatched, getViewingHistory } from '../../api/modules/anime';
import useLazyLoad from '../../hooks/useLazyLoad';
import styles from './AnimeEpisodes.module.css';

const AnimeEpisodes = React.memo(({ anime, openModal, t }) => {
  const [visibleEpisodes, setVisibleEpisodes] = useState(10);
  const [watchedEpisodes, setWatchedEpisodes] = useState({});
  const [watchedCount, setWatchedCount] = useState(0);
  const [ref, isIntersecting] = useLazyLoad();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchViewingHistory = async () => {
      try {
        const history = await getViewingHistory(anime._id);
        const initialWatched = {};
        history.forEach(item => {
          initialWatched[item.episodeId] = true;
        });
        setWatchedEpisodes(initialWatched);
        setWatchedCount(history.length);
      } catch (error) {
        console.error('Error fetching viewing history:', error);
      }
    };

    fetchViewingHistory();
  }, [anime._id]);

  useEffect(() => {
    if (isIntersecting) {
      setVisibleEpisodes(prevVisibleEpisodes => prevVisibleEpisodes + 10);
    }
  }, [isIntersecting]);

  const handleMarkAsWatched = async (animeId, episodeId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setSnackbarMessage('Please login to mark as watched');
      setSnackbarOpen(true);
      return;
    }

    try {
      console.log('Marking as watched:', { animeId, episodeId });
      await markAsWatched(animeId, episodeId);
      setWatchedEpisodes(prevWatched => ({
        ...prevWatched,
        [episodeId]: true
      }));
      setWatchedCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error marking episode as watched:', error);
    }
  };

  const handleMarkAsUnwatched = async (animeId, episodeId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setSnackbarMessage('Please login to mark as unwatched');
      setSnackbarOpen(true);
      return;
    }

    try {
      await markAsUnwatched(animeId, episodeId);
      setWatchedEpisodes(prevWatched => {
        const newWatched = { ...prevWatched };
        delete newWatched[episodeId];
        return newWatched;
      });
      setWatchedCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error marking episode as unwatched:', error);
    }
  };

  const handleEpisodeClick = (episode) => {
    handleMarkAsWatched(anime._id, episode._id);
    openModal(episode);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box className={styles.animeEpisodes}>
      <Typography variant="h5" className={styles.title}>{t('animeDetails.episodes')}</Typography>
      {/* <Typography variant="subtitle1" className={styles.watchedCount}>
        {t('animeDetails.watchedCount', { count: watchedCount })}
      </Typography> */}
      <ul className={styles.episodeList}>
        {anime.episodes.slice(0, visibleEpisodes).map((episode, index) => (
          <li
            key={episode._id}
            className={styles.episodeItem}
            ref={index === anime.episodes.slice(0, visibleEpisodes).length - 1 ? ref : null}
            onClick={() => handleEpisodeClick(episode)}
          >
            <Typography variant="body1" className={styles.episodeTitle}>
              {episode.title}
            </Typography>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                watchedEpisodes[episode._id]
                  ? handleMarkAsUnwatched(anime._id, episode._id)
                  : handleMarkAsWatched(anime._id, episode._id);
              }}
              className={styles.eyeIcon}
              aria-label={watchedEpisodes[episode._id] ? 'Mark as unwatched' : 'Mark as watched'}
            >
              {watchedEpisodes[episode._id] ? <Visibility color="primary" /> : <VisibilityOff />}
            </IconButton>
          </li>
        ))}
      </ul>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default AnimeEpisodes;