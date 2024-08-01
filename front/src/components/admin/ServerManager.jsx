import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Tooltip } from '@mui/material';
import { Add, Delete, Edit, FileCopy } from '@mui/icons-material';
import styles from './ServerManager.module.css';

const qualityOptions = ['360p', '480p', '720p', '1080p', '4K'];
const commonStreamingDomains = ['youtube', 'vimeo', 'dailymotion', 'streamable', 'twitch'];
const commonDownloadDomains = ['mega', 'mediafire', 'dropbox', 'drive.google'];

const ServerManager = ({ streamingServers, setStreamingServers, downloadServers, setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming' });
  const [editServer, setEditServer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const detectServerInfo = (url) => {
    let name = '';
    let type = 'streaming';
    let quality = '';

    try {
      // Check if the input is a valid URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
      }
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const pathname = urlObj.pathname;
      
      // Detect server name
      if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
        name = 'YouTube';
      } else if (hostname.includes('vimeo')) {
        name = 'Vimeo';
      } else if (hostname.includes('dailymotion')) {
        name = 'Dailymotion';
      } else if (hostname.includes('streamable')) {
        name = 'Streamable';
      } else if (hostname.includes('twitch')) {
        name = 'Twitch';
      } else if (hostname.includes('ok.ru')) {
        name = 'OK.ru';
      } else if (hostname.includes('videa')) {
        name = 'Videa';
      } else if (commonDownloadDomains.some(domain => hostname.includes(domain))) {
        name = hostname.split('.').slice(-2, -1)[0];
        type = 'download';
      } else {
        // Extract name from subdomain or first part of domain
        const parts = hostname.split('.');
        name = parts.length > 2 ? parts[0] : parts[parts.length - 2];
      }
      
      // Capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Detect quality
      const qualityMatch = url.match(/(\d{3,4}p)/i) || pathname.match(/(\d{3,4}p)/i);
      if (qualityMatch) {
        quality = qualityMatch[1].toLowerCase();
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      // Return default values if URL parsing fails
      return { name, type, quality };
    }
    
    return { name, type, quality };
  };

  const handleServerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'url') {
      const { name: detectedName, type: detectedType, quality: detectedQuality } = detectServerInfo(value);
      setNewServer(prev => ({
        ...prev,
        serverName: detectedName || prev.serverName,
        type: detectedType,
        quality: detectedQuality || prev.quality,
        [name]: value
      }));
    } else {
      setNewServer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditServerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'url') {
      const { name: detectedName, type: detectedType, quality: detectedQuality } = detectServerInfo(value);
      setEditServer(prev => ({
        ...prev,
        serverName: detectedName || prev.serverName,
        type: detectedType,
        quality: detectedQuality || prev.quality,
        [name]: value
      }));
    } else {
      setEditServer(prev => ({ ...prev, [name]: value }));
    }
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
      updatedServers[index] = updatedServer;
      setStreamingServers(updatedServers);
    } else {
      const updatedServers = [...downloadServers];
      updatedServers[index] = updatedServer;
      setDownloadServers(updatedServers);
    }
    setOpenEditDialog(false);
  };

  const extractEmbedUrl = (iframeCode) => {
    const srcMatch = iframeCode.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : '';
  };

  const handleUrlChange = (e) => {
    const fullUrl = e.target.value;
    const embedUrl = extractEmbedUrl(fullUrl);
    handleServerChange({ target: { name: 'url', value: embedUrl || fullUrl } });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a snackbar notification here if you want
      console.log('Copied to clipboard');
    });
  };

  return (
    <Paper className={styles.serverSection} elevation={3}>
      <Typography variant="h6" className={styles.title}>Add Server</Typography>
      <Box className={styles.form}>
        <TextField
          label="Server Name"
          name="serverName"
          value={newServer.serverName}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
          placeholder="Enter server name (auto-detected)"
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
          onChange={handleUrlChange}
          fullWidth
          margin="normal"
          placeholder="Paste full iframe code or URL"
          multiline
          rows={3}
          variant="outlined"
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