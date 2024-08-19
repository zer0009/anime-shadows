import React, { useState } from 'react';
import { Typography, Box, Grid, IconButton, Modal, Button } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import styles from './DownloadSection.module.css';

const DownloadSection = ({ episode, t }) => {
  const [open, setOpen] = useState(false);
  const [selectedServers, setSelectedServers] = useState([]);

  const handleOpen = (servers) => {
    setSelectedServers(servers);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedServers([]);
  };

  const groupDownloadsByQuality = () => {
    const grouped = {};
    episode.downloadServers.forEach(server => {
      if (!grouped[server.quality]) {
        grouped[server.quality] = [];
      }
      grouped[server.quality].push(server);
    });
    return grouped;
  };

  const sortedQualities = Object.entries(groupDownloadsByQuality()).sort((a, b) => {
    const qualityOrder = ['1080p', '720p', '480p', '360p'];
    return qualityOrder.indexOf(a[0]) - qualityOrder.indexOf(b[0]);
  });

  const renderQualityButtons = () => (
    sortedQualities.map(([quality, servers]) => (
      <Grid item key={quality}>
        <Box className={styles.qualityGroup}>
          <IconButton onClick={() => handleOpen(servers)} className={styles.downloadIcon}>
            <CloudDownloadIcon fontSize="large" />
            <Typography variant="h6" className={styles.qualityChip}>
              {quality}
            </Typography>
          </IconButton>
        </Box>
      </Grid>
    ))
  );

  const renderModalContent = () => (
    <Box className={styles.modalContent}>
      <Typography variant="h6" className={styles.modalTitle}>
        {t('episodePage.downloadList')}
      </Typography>
      <Box className={styles.qualityDetailsContainer}>
        {selectedServers.map((server, index) => (
          <Button
            key={index}
            variant="contained"
            className={styles.downloadButton}
            href={server.url}
            download
          >
            {server.serverName}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box className={styles.downloadSection}>
      <Typography variant="h6" className={styles.downloadTitle}>
        {t('episodePage.downloadEpisode')}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {renderQualityButtons()}
      </Grid>
      <Modal open={open} onClose={handleClose} className={styles.modal}>
        {renderModalContent()}
      </Modal>
    </Box>
  );
};

export default DownloadSection;