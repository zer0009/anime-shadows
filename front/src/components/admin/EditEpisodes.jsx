import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { addEpisode, editEpisode, deleteEpisode } from '../../api/modules/admin';
import { fetchEpisodesByAnimeId } from '../../api/modules/episode';
import { useParams } from 'react-router-dom';
import ServerManager from './ServerManager'; // Import ServerManager component
import styles from './EditEpisodes.module.css';

const EditEpisodes = () => {
  const { animeId } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [streamingServers, setStreamingServers] = useState([]);
  const [downloadServers, setDownloadServers] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered with animeId:", animeId);
    const loadEpisodes = async () => {
      try {
        const data = await fetchEpisodesByAnimeId(animeId);
        console.log("Fetched episodes data:", data);
        setEpisodes(data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };
    loadEpisodes();
  }, [animeId]);

  const handleAddEpisode = async () => {
    try {
      const newEpisode = await addEpisode(animeId, { number: episodeNumber, title: episodeTitle, streamingServers, downloadServers });
      console.log("Added new episode:", newEpisode);
      setEpisodes([...episodes, newEpisode]);
      setEpisodeNumber('');
      setEpisodeTitle('');
      setStreamingServers([]);
      setDownloadServers([]);
    } catch (error) {
      console.error('Error adding episode:', error);
    }
  };

  const handleEditEpisode = async () => {
    try {
      const updatedEpisode = await editEpisode(animeId, selectedEpisode._id, { number: episodeNumber, title: episodeTitle, streamingServers, downloadServers });
      console.log("Edited episode:", updatedEpisode);
      setEpisodes(episodes.map(ep => ep._id === selectedEpisode._id ? updatedEpisode : ep));
      setSelectedEpisode(null);
      setEpisodeNumber('');
      setEpisodeTitle('');
      setStreamingServers([]);
      setDownloadServers([]);
    } catch (error) {
      console.error('Error editing episode:', error);
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    try {
      await deleteEpisode(animeId, episodeId);
      console.log("Deleted episode with ID:", episodeId);
      setEpisodes(episodes.filter(ep => ep._id !== episodeId));
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  };

  const handleEditClick = (episode) => {
    console.log("Editing episode:", episode);
    setSelectedEpisode(episode);
    setEpisodeNumber(episode.number);
    setEpisodeTitle(episode.title);
    setStreamingServers(episode.streamingServers);
    setDownloadServers(episode.downloadServers);
  };

  return (
    <div>
      <Typography variant="h6">Manage Episodes</Typography>
      <Paper className={styles.paper}>
        <form className={styles.form}>
          <TextField
            label="Episode Number"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Episode Title"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            fullWidth
            margin="dense"
          />
          <ServerManager
            streamingServers={streamingServers}
            setStreamingServers={setStreamingServers}
            downloadServers={downloadServers}
            setDownloadServers={setDownloadServers}
          />
          {selectedEpisode ? (
            <Button onClick={handleEditEpisode} variant="contained" color="primary" fullWidth className={styles.submitButton}>
              Save Episode
            </Button>
          ) : (
            <Button onClick={handleAddEpisode} variant="contained" color="primary" fullWidth className={styles.submitButton}>
              Add Episode
            </Button>
          )}
        </form>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Streaming Servers</TableCell>
              <TableCell>Download Servers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {episodes.map((episode) => (
              <TableRow key={episode._id}>
                <TableCell>{episode.number}</TableCell>
                <TableCell>{episode.title}</TableCell>
                <TableCell>{episode.streamingServers.map(server => server.url).join(', ')}</TableCell>
                <TableCell>{episode.downloadServers.map(server => server.url).join(', ')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(episode)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEpisode(episode._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedEpisode && (
        <Box mt={2}>
          <Typography variant="h6">Streaming Servers</Typography>
          <List>
            {streamingServers.length > 0 ? (
              streamingServers.map((server, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No streaming servers available" />
              </ListItem>
            )}
          </List>
          <Typography variant="h6">Download Servers</Typography>
          <List>
            {downloadServers.length > 0 ? (
              downloadServers.map((server, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${server.serverName} - ${server.quality}`} secondary={server.url} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No download servers available" />
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </div>
  );
};

export default EditEpisodes;