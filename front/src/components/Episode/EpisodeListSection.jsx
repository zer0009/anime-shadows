import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import styles from './EpisodeListSection.module.css';

const EpisodeListSection = ({ episodes, i18n, t }) => {
  const { episodeId } = useParams();

  return (
    <Box className={styles.episodeListSection}>
      <Typography variant="h6" className={styles.episodeListTitle}>
        {t('episodePage.allEpisodes')}
      </Typography>
      <Box className={styles.episodeListContainer}>
        <List className={styles.episodeList}>
          {episodes.length > 0 ? (
            episodes.map((ep) => (
              <ListItem 
                key={ep._id} 
                button
                component={Link} 
                to={`/episode/${ep._id}`} 
                className={`${styles.episodeItem} ${ep._id === episodeId ? styles.currentEpisode : ''}`}
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
            ))
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