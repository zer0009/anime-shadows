import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './AnimeEpisodes.module.css';

const AnimeEpisodes = ({ anime, openModal, t }) => {
  return (
    <Box className={styles.animeEpisodes}>
      <Typography variant="h5">{t('animeDetails.episodes')}</Typography>
      <ul className={styles.episodeList}>
        {anime.episodes && anime.episodes.length > 0 ? (
          anime.episodes.map(episode => (
            <li key={episode._id} className={styles.episodeItem} onClick={() => openModal(episode)}>
              <Typography variant="body1">{episode.title}</Typography>
            </li>
          ))
        ) : (
          <Typography>{t('animeDetails.noEpisodes')}</Typography>
        )}
      </ul>
    </Box>
  );
};

export default AnimeEpisodes;