import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, Tooltip, Switch, FormControlLabel, CircularProgress, Tabs, Tab, Grid } from '@mui/material';
import { Add, Delete, Edit, FileCopy, Refresh, Clear } from '@mui/icons-material';
import { scrapeWitanime, scrapeAnimeLuxe, scrapeGogoanime } from '../../api/modules/admin';
import styles from './ServerManager.module.css';

const predefinedQualityOptions = ['SD', 'HD', 'FHD', 'multi'];
const subtitleOptions = ['AR', 'EN', 'RAW'];

const mapQuality = (quality) => {
  const lowerQuality = quality.toLowerCase();
  if (['360p', '480p'].includes(lowerQuality)) return 'SD';
  if (['720p'].includes(lowerQuality)) return 'HD';
  if (['1080p', 'fhd'].includes(lowerQuality)) return 'FHD';
  return quality;
};

const ServerManager = ({ streamingServers = [], setStreamingServers, downloadServers = [], setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming', subtitle: '' });
  const [editServer, setEditServer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraperSource, setScraperSource] = useState('animeluxe');
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
    if (newServer.serverName && newServer.url && newServer.subtitle) {
      const mappedQuality = mapQuality(newServer.quality);
      const serverToAdd = { ...newServer, quality: mappedQuality };
      if (newServer.type === 'streaming') {
        setStreamingServers(prev => [...prev, serverToAdd]);
      } else {
        setDownloadServers(prev => [...prev, serverToAdd]);
      }
      setNewServer({ serverName: '', quality: '', url: '', type: 'streaming', subtitle: '' });
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
      let scrapeFunction;
      switch (scraperSource) {
        case 'animeluxe':
          scrapeFunction = scrapeAnimeLuxe;
          break;
        case 'witanime':
          scrapeFunction = scrapeWitanime;
          break;
        case 'gogoanime':
          scrapeFunction = scrapeGogoanime;
          break;
        default:
          throw new Error('Invalid scraper source');
      }
      
      const servers = await scrapeFunction(scrapeUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      
      console.log('Scraped servers:', servers);

      const mappedServers = servers.map(server => ({
        ...server,
        quality: mapQuality(server.quality),
        subtitle: server.subtitle || 'RAW' // Set a default subtitle if not provided
      }));

      setStreamingServers(prevServers => [...prevServers, ...mappedServers.filter(server => server.type === 'streaming')]);
      setDownloadServers(prevServers => [...prevServers, ...mappedServers.filter(server => server.type === 'download')]);
    } catch (error) {
      console.error('Error scraping website:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllServers = () => {
    setOpenClearDialog(true);
  };

  const confirmClearAllServers = () => {
    setStreamingServers([]);
    setDownloadServers([]);
    setOpenClearDialog(false);
  };

  const renderServerList = (servers, type) => {
    console.log(`Rendering ${type} servers:`, servers);
    if (!servers || !Array.isArray(servers) || servers.length === 0) {
      console.log(`No ${type} servers available`);
      return <Typography>No {type} servers available.</Typography>;
    }
    return (
      <List>
        {servers.map((server, index) => (
          <ListItem key={index} className={styles.listItem}>
            <ListItemText 
              primary={
                <Typography variant="subtitle1">
                  {server.serverName} 
                  <Chip label={server.quality} size="small" color={type === 'streaming' ? 'primary' : 'secondary'} className={styles.qualityChip} />
                  <Chip label={server.subtitle} size="small" color="default" className={styles.subtitleChip} />
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
  };

  return (
    <Paper className={styles.serverManager}>
      <Typography variant="h6" className={styles.title}>Server Manager</Typography>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
        <Tab label="Scrape" />
        <Tab label="Servers" />
        <Tab label="Add" />
      </Tabs>
      
      {tabValue === 2 && (
        <Box className={styles.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Server Name"
                name="serverName"
                value={newServer.serverName}
                onChange={handleServerChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quality"
                name="quality"
                select
                value={newServer.quality}
                onChange={handleServerChange}
                fullWidth
                size="small"
              >
                {predefinedQualityOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL"
                name="url"
                value={newServer.url}
                onChange={handleServerChange}
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Type"
                name="type"
                select
                value={newServer.type}
                onChange={handleServerChange}
                fullWidth
                size="small"
              >
                <MenuItem value="streaming">Streaming</MenuItem>
                <MenuItem value="download">Download</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subtitle"
                name="subtitle"
                select
                value={newServer.subtitle}
                onChange={handleServerChange}
                fullWidth
                size="small"
              >
                {subtitleOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={addServer}
                startIcon={<Add />}
                fullWidth
              >
                Add Server
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box className={styles.serverList}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearAllServers}
            startIcon={<Clear />}
            fullWidth
            style={{ marginBottom: '16px' }}
          >
            Clear All Servers
          </Button>
          <Typography variant="subtitle1" className={styles.subtitle}>Streaming Servers</Typography>
          {console.log('Streaming Servers:', streamingServers)}
          {renderServerList(streamingServers, 'streaming')}
          <Typography variant="subtitle1" className={styles.subtitle}>Download Servers</Typography>
          {console.log('Download Servers:', downloadServers)}
          {renderServerList(downloadServers, 'download')}
        </Box>
      )}

      {tabValue === 0 && (
        <Box className={styles.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Scrape URL"
                name="scrapeUrl"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Scraper Source"
                name="scraperSource"
                select
                value={scraperSource}
                onChange={(e) => setScraperSource(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="animeluxe">AnimeLuxe</MenuItem>
                <MenuItem value="witanime">Witanime</MenuItem>
                <MenuItem value="gogoanime">Gogoanime</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleScrapeWebsite}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                fullWidth
              >
                Scrape Servers
              </Button>
            </Grid>
          </Grid>
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
          <TextField
            label="Subtitle"
            name="subtitle"
            select
            value={editServer?.subtitle || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            {subtitleOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
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

      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Clear All Servers?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to clear all servers? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmClearAllServers} color="secondary" autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServerManager;