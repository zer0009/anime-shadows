import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import styles from './ServerManager.module.css';

const qualityOptions = ['360p', '480p', '720p', '1080p', '4K'];

const ServerManager = ({ streamingServers, setStreamingServers, downloadServers, setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming' });
  const [editServer, setEditServer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleServerChange = (e) => {
    setNewServer({ ...newServer, [e.target.name]: e.target.value });
  };

  const handleEditServerChange = (e) => {
    setEditServer({ ...editServer, [e.target.name]: e.target.value });
  };

  const addServer = () => {
    if (newServer.serverName && newServer.quality && newServer.url) {
      if (newServer.type === 'streaming') {
        setStreamingServers([...streamingServers, newServer]);
      } else {
        setDownloadServers([...downloadServers, newServer]);
      }
      setNewServer({ serverName: '', quality: '', url: '', type: 'streaming' });
    } else {
      alert('Please fill in all server fields');
    }
  };

  const removeServer = (type, index) => {
    if (type === 'streaming') {
      const updatedServers = streamingServers.filter((_, i) => i !== index);
      setStreamingServers(updatedServers);
    } else {
      const updatedServers = downloadServers.filter((_, i) => i !== index);
      setDownloadServers(updatedServers);
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

  return (
    <Paper className={styles.serverSection}>
      <Typography variant="h6" className={styles.title}>Add Server</Typography>
      <Box className={styles.form}>
        <TextField
          label="Server Name"
          name="serverName"
          value={newServer.serverName}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
          placeholder="Enter server name"
        />
        <TextField
          label="Quality"
          name="quality"
          select
          value={newServer.quality}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
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
        />
        <TextField
          label="Type"
          name="type"
          select
          value={newServer.type}
          onChange={handleServerChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="streaming">Streaming</MenuItem>
          <MenuItem value="download">Download</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={addServer} startIcon={<Add />} fullWidth>
          Add Server
        </Button>
      </Box>
      <Box className={styles.serverList}>
        <Typography variant="h6" className={styles.subtitle}>Streaming Servers</Typography>
        <List>
          {streamingServers.map((server, index) => (
            <ListItem key={index} className={styles.listItem}>
              <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
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
              <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
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
          />
          <TextField
            label="Quality"
            name="quality"
            select
            value={editServer?.quality || ''}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
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
          />
          <TextField
            label="Type"
            name="type"
            select
            value={editServer?.type || 'streaming'}
            onChange={handleEditServerChange}
            fullWidth
            margin="normal"
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
