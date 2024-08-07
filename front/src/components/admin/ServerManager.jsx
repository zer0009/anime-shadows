import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Tooltip, Switch, FormControlLabel } from '@mui/material';
import { Add, Delete, Edit, FileCopy } from '@mui/icons-material';
import { scrapeWitanime, scrapeAnimeLuxe } from '../../api/modules/admin';
import styles from './ServerManager.module.css';

const qualityOptions = ['360p', '480p', '720p', '1080p'];

const ServerManager = ({ streamingServers, setStreamingServers, downloadServers, setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming' });
  const [editServer, setEditServer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [useScrape, setUseScrape] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraperSource, setScraperSource] = useState('witanime');

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
      if (newServer.type === 'streaming') {
        setStreamingServers([...streamingServers, newServer]);
      } else {
        setDownloadServers([...downloadServers, newServer]);
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
    if (type === 'streaming') {
      const updatedServers = [...streamingServers];
      updatedServers[index] = { ...updatedServer, type };
      setStreamingServers(updatedServers);
    } else {
      const updatedServers = [...downloadServers];
      updatedServers[index] = { ...updatedServer, type };
      setDownloadServers(updatedServers);
    }
    setOpenEditDialog(false);
  };

  const handleScrapeWebsite = async () => {
    try {
      const scrapeFunction = scraperSource === 'witanime' ? scrapeWitanime : scrapeAnimeLuxe;
      const servers = await scrapeFunction(scrapeUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      if (scraperSource === 'witanime') {
        setStreamingServers(servers);
      } else {
        setDownloadServers(servers);
      }
    } catch (error) {
      console.error('Error scraping website:', error);
    }
  };

  return (
    <Paper className={styles.serverManager}>
      <Typography variant="h6" className={styles.title}>Server Manager</Typography>
      <FormControlLabel
        control={<Switch checked={useScrape} onChange={() => setUseScrape(!useScrape)} />}
        label="Use Scrape"
      />
      {useScrape && (
        <Box className={styles.form}>
          <TextField
            label="Scrape URL"
            name="scrapeUrl"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Enter URL to scrape"
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
            color="secondary" 
            onClick={handleScrapeWebsite} 
            startIcon={<Add />} 
            fullWidth
            className={styles.addButton}
          >
            Scrape Website
          </Button>
        </Box>
      )}
      <Box className={styles.form}>
        <TextField
          label="Server Name"
          name="serverName"
          value={newServer.serverName}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
          placeholder="Enter server name"
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
          {qualityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="URL"
          name="url"
          value={newServer.url}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
          placeholder="Enter server URL"
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
      <Box className={styles.serverList}>
        <Typography variant="h6" className={styles.subtitle}>Streaming Servers</Typography>
        <List>
          {streamingServers.map((server, index) => (
            <ListItem key={index} className={styles.listItem}>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1">
                    {server.serverName} 
                    <Chip label={server.quality} size="small" color="primary" className={styles.qualityChip} />
                  </Typography>
                } 
                secondary={server.url} 
              />
              <Tooltip title="Copy URL">
                <IconButton edge="end" aria-label="copy" onClick={() => copyToClipboard(server.url)}>
                  <FileCopy />
                </IconButton>
              </Tooltip>
              <IconButton edge="end" aria-label="edit" onClick={() => openEditDialogHandler(server, 'streaming', index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => removeServer('streaming', index)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" className={styles.subtitle}>Download Servers</Typography>
        <List>
          {downloadServers.map((server, index) => (
            <ListItem key={index} className={styles.listItem}>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1">
                    {server.serverName}
                    <Chip label={server.quality} size="small" color="secondary" className={styles.qualityChip} />
                  </Typography>
                } 
                secondary={server.url} 
              />
              <Tooltip title="Copy URL">
                <IconButton edge="end" aria-label="copy" onClick={() => copyToClipboard(server.url)}>
                  <FileCopy />
                </IconButton>
              </Tooltip>
              <IconButton edge="end" aria-label="edit" onClick={() => openEditDialogHandler(server, 'download', index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => removeServer('download', index)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
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
            placeholder="Enter server name"
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
            {qualityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="URL"
            name="url"
            value={editServer?.url || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
            placeholder="Enter server URL"
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