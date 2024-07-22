import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import {addEpisode, editEpisode, deleteEpisode } from '../../api/modules/admin';
import { fetchEpisodesByAnimeId } from '../../api/modules/episode';
import { useParams } from 'react-router-dom';
import styles from './EditEpisodes.module.css';

const EditEpisodes = () => {
  const { animeId } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [servers, setServers] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const loadEpisodes = async () => {
      const data = await fetchEpisodesByAnimeId(animeId);
      setEpisodes(data);
    };
    loadEpisodes();
  }, [animeId]);

  const handleAddEpisode = async () => {
    try {
      const newEpisode = await addEpisode(animeId, { number: episodeNumber, title: episodeTitle, servers });
      setEpisodes([...episodes, newEpisode]);
      setEpisodeNumber('');
      setEpisodeTitle('');
      setServers([]);
    } catch (error) {
      console.error('Error adding episode:', error);
    }
  };

  const handleEditEpisode = async () => {
    try {
      const updatedEpisode = await editEpisode(animeId, selectedEpisode._id, { number: episodeNumber, title: episodeTitle, servers });
      setEpisodes(episodes.map(ep => ep._id === selectedEpisode._id ? updatedEpisode : ep));
      setSelectedEpisode(null);
      setEpisodeNumber('');
      setEpisodeTitle('');
      setServers([]);
    } catch (error) {
      console.error('Error editing episode:', error);
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    try {
      await deleteEpisode(animeId, episodeId);
      setEpisodes(episodes.filter(ep => ep._id !== episodeId));
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  };

  const handleEditClick = (episode) => {
    setSelectedEpisode(episode);
    setEpisodeNumber(episode.number);
    setEpisodeTitle(episode.title);
    setServers(episode.servers);
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
            margin="normal"
          />
          <TextField
            label="Episode Title"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Servers"
            value={servers.join(', ')}
            onChange={(e) => setServers(e.target.value.split(', '))}
            fullWidth
            margin="normal"
            placeholder="Enter server URLs separated by commas"
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
              <TableCell>Servers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {episodes.map((episode) => (
              <TableRow key={episode._id}>
                <TableCell>{episode.number}</TableCell>
                <TableCell>{episode.title}</TableCell>
                <TableCell>{episode.servers.join(', ')}</TableCell>
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
    </div>
  );
};

export default EditEpisodes;