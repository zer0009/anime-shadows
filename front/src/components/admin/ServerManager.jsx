import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Tooltip, Switch, FormControlLabel, CircularProgress, Tabs, Tab } from '@mui/material';
import { Add, Delete, Edit, FileCopy, Refresh } from '@mui/icons-material';
import { scrapeWitanime, scrapeAnimeLuxe } from '../../api/modules/admin';
import styles from './ServerManager.module.css';

const predefinedQualityOptions = ['SD', 'HD', 'FHD', 'multi'];
const mapQuality = (quality) => {
  const lowerQuality = quality.toLowerCase();
  if (['360p', '480p'].includes(lowerQuality)) return 'SD';
  if (['720p'].includes(lowerQuality)) return 'HD';
  if (['1080p', 'fhd'].includes(lowerQuality)) return 'FHD';
  return quality;
};

const ServerManager = ({ streamingServers, setStreamingServers, downloadServers, setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming' });
  const [editServer, setEditServer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [useScrape, setUseScrape] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraperSource, setScraperSource] = useState('witanime');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleServerChange = (e) => {
    const { name, value } = e.target;
    setNewServer(prev => ({ ...prev, [name]: value }));
  };

  const handleEditServerChange = (e) => {
    const { name, value } = e.target;
    setEditServer(prev => ({ ...prev, [name]: value }));
  };

  const addServer = () => {
    if (newServer.serverName && newServer.url) {
      const mappedQuality = mapQuality(newServer.quality);
      const serverToAdd = { ...newServer, quality: mappedQuality };
      if (newServer.type === 'streaming') {
        setStreamingServers([...streamingServers, serverToAdd]);
      } else {
        setDownloadServers([...downloadServers, serverToAdd]);
      }
      setNewServer({ serverName: '', quality: '', url: '', type: 'streaming' });
    }
  };

  const removeServer = (type, index) => {
    if (type === 'streaming') {
      setStreamingServers(streamingServers.filter((_, i) => i !== index));
    } else {
      setDownloadServers(downloadServers.filter((_, i) => i !== index));
    }
  };

  const openEditDialogHandler = (server, type, index) => {
    setEditServer({ ...server, type, index });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = () => {
    const { type, index, ...updatedServer } = editServer;
    const mappedQuality = mapQuality(updatedServer.quality);
    const serverToUpdate = { ...updatedServer, quality: mappedQuality, type };
    if (type === 'streaming') {
      const updatedServers = [...streamingServers];
      updatedServers[index] = serverToUpdate;
      setStreamingServers(updatedServers);
    } else {
      const updatedServers = [...downloadServers];
      updatedServers[index] = serverToUpdate;
      setDownloadServers(updatedServers);
    }
    setOpenEditDialog(false);
  };

  const handleScrapeWebsite = async () => {
    setLoading(true);
    try {
      const scrapeFunction = scraperSource === 'witanime' ? scrapeWitanime : scrapeAnimeLuxe;
      const servers = await scrapeFunction(scrapeUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const mappedServers = servers.map(server => ({
        ...server,
        quality: mapQuality(server.quality)
      }));
      setStreamingServers(mappedServers.filter(server => server.type === 'streaming'));
      setDownloadServers(mappedServers.filter(server => server.type === 'download'));
    } catch (error) {
      console.error('Error scraping website:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServerList = (servers, type) => (
    <List>
      {servers.map((server, index) => (
        <ListItem key={index} className={styles.listItem}>
          <ListItemText 
            primary={
              <Typography variant="subtitle1">
                {server.serverName} 
                <Chip label={server.quality} size="small" color={type === 'streaming' ? 'primary' : 'secondary'} className={styles.qualityChip} />
              </Typography>
            } 
            secondary={server.url} 
          />
          <Tooltip title="Copy URL">
            <IconButton edge="end" aria-label="copy" onClick={() => navigator.clipboard.writeText(server.url)}>
              <FileCopy />
            </IconButton>
          </Tooltip>
          <IconButton edge="end" aria-label="edit" onClick={() => openEditDialogHandler(server, type, index)}>
            <Edit />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => removeServer(type, index)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Paper className={styles.serverManager}>
      <Typography variant="h6" className={styles.title}>Server Manager</Typography>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
        <Tab label="Add Server" />
        <Tab label="Server List" />
        <Tab label="Scrape Servers" />
      </Tabs>
      
      {tabValue === 0 && (
        <Box className={styles.form}>
          <TextField
            label="Server Name"
            name="serverName"
            value={newServer.serverName}
            onChange={handleServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Quality"
            name="quality"
            select
            value={newServer.quality}
            onChange={handleServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            {predefinedQualityOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="URL"
            name="url"
            value={newServer.url}
            onChange={handleServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
          <TextField
            label="Type"
            name="type"
            select
            value={newServer.type}
            onChange={handleServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="streaming">Streaming</MenuItem>
            <MenuItem value="download">Download</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={addServer}
            startIcon={<Add />}
            fullWidth
            className={styles.addButton}
          >
            Add Server
          </Button>
        </Box>
      )}

      {tabValue === 1 && (
        <Box className={styles.serverList}>
          <Typography variant="h6" className={styles.subtitle}>Streaming Servers</Typography>
          {renderServerList(streamingServers, 'streaming')}
          <Typography variant="h6" className={styles.subtitle}>Download Servers</Typography>
          {renderServerList(downloadServers, 'download')}
        </Box>
      )}

      {tabValue === 2 && (
        <Box className={styles.form}>
          <TextField
            label="Scrape URL"
            name="scrapeUrl"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Scraper Source"
            name="scraperSource"
            select
            value={scraperSource}
            onChange={(e) => setScraperSource(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="witanime">Witanime</MenuItem>
            <MenuItem value="animeluxe">AnimeLuxe</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScrapeWebsite}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : <Refresh />}
            fullWidth
            className={styles.addButton}
          >
            Scrape Servers
          </Button>
        </Box>
      )}

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Server</DialogTitle>
        <DialogContent>
          <TextField
            label="Server Name"
            name="serverName"
            value={editServer?.serverName || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Quality"
            name="quality"
            select
            value={editServer?.quality || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            {predefinedQualityOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="URL"
            name="url"
            value={editServer?.url || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
          <TextField
            label="Type"
            name="type"
            select
            value={editServer?.type || 'streaming'}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="streaming">Streaming</MenuItem>
            <MenuItem value="download">Download</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServerManager;