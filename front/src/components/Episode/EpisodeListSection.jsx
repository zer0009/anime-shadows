import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import styles from './EpisodeListSection.module.css';

const EpisodeListSection = ({ episodes, i18n, t }) => {
  const { episodeSlug } = useParams();
  const episodeId = parseInt(episodeSlug.split('-الحلقة-')[1], 10); // Extract and parse episode number as integer
  console.log('episodeId', episodeId);

  const renderEpisodeItem = (ep) => (
    <ListItem 
      key={ep._id} 
      button
      component={Link} 
      to={`/episode/${ep.anime.slug}-الحلقة-${ep.number}`}
      className={`${styles.episodeItem} ${ep.number === episodeId ? styles.currentEpisode : ''}`} // Compare episode number
      style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
    >
      <ListItemText 
        primary={
          <React.Fragment>
            <Typography component="span" className={styles.episodeNumber}>
              {t('episodePage.episode')} {ep.number}
            </Typography>
          </React.Fragment>
        }
        className={styles.episodeItemText}
      />
    </ListItem>
  );

  return (
    <Box className={styles.episodeListSection}>
      <Typography variant="h6" className={styles.episodeListTitle}>
        {t('episodePage.allEpisodes')}
      </Typography>
      <Box className={styles.episodeListContainer}>
        <List className={styles.episodeList}>
          {episodes.length > 0 ? (
            episodes.map(renderEpisodeItem)
          ) : (
            <ListItem>
              <ListItemText primary={t('episodePage.loadingEpisodes')} />
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default EpisodeListSection;