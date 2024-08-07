import React from 'react';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FlagIcon from '@mui/icons-material/Flag';
import styles from './HeaderSection.module.css';

const HeaderSection = ({ episode, t }) => {
  const handleDownload = () => {
    // Implement download functionality
    console.log('Download clicked');
  };

  const handleReport = () => {
    // Implement report functionality
    console.log('Report clicked');
  };

  return (
    <Box className={styles.headerSection}>
      <Typography variant="h5" className={styles.animeTitle}>
        <span className={styles.animeTitleText}>
          {episode.anime.title} - 
        </span>
        <span className={styles.episodeNumber}>
          {t('episodePage.episode')} {episode.number}
        </span>
      </Typography>
      {/* <Box className={styles.iconContainer}>
        <Tooltip title={t('episodePage.download')}>
          <IconButton onClick={handleDownload} className={styles.iconButton}>
            <CloudDownloadIcon />
            <Typography variant="caption" className={styles.iconLabel}>
              {t('episodePage.download')}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title={t('episodePage.report')}>
          <IconButton onClick={handleReport} className={styles.iconButton}>
            <FlagIcon />
            <Typography variant="caption" className={styles.iconLabel}>
              {t('episodePage.report')}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box> */}
    </Box>
  );
};

export default HeaderSection;