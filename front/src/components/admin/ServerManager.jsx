import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import styles from './ServerManager.module.css';

const ServerManager = ({ streamingServers, setStreamingServers, downloadServers, setDownloadServers }) => {
  const [newServer, setNewServer] = useState({ serverName: '', quality: '', url: '', type: 'streaming' });

  const handleServerChange = (e) => {
    setNewServer({ ...newServer, [e.target.name]: e.target.value });
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

  return (
    <Box className={styles.serverSection}>
      <Typography variant="h6">Add Server</Typography>
      <TextField
        label="Server Name"
        name="serverName"
        value={newServer.serverName}
        onChange={handleServerChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quality"
        name="quality"
        value={newServer.quality}
        onChange={handleServerChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="URL"
        name="url"
        value={newServer.url}
        onChange={handleServerChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Type"
        name="type"
        select
        SelectProps={{ native: true }}
        value={newServer.type}
        onChange={handleServerChange}
        fullWidth
        margin="normal"
      >
        <option value="streaming">Streaming</option>
        <option value="download">Download</option>
      </TextField>
      <Button variant="contained" color="primary" onClick={addServer} startIcon={<Add />}>
        Add Server
      </Button>
      <Box className={styles.serverList}>
        <Typography variant="h6">Streaming Servers</Typography>
        <List>
          {streamingServers.map((server, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
              <IconButton edge="end" aria-label="delete" onClick={() => removeServer('streaming', index)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Download Servers</Typography>
        <List>
          {downloadServers.map((server, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
              <IconButton edge="end" aria-label="delete" onClick={() => removeServer('download', index)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ServerManager;