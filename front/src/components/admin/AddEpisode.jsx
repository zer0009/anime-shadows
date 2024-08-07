import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Paper, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { addEpisode, updateEpisode, deleteEpisode } from '../../api/modules/admin';
import { fetchEpisodesByAnimeId } from '../../api/modules/anime';
import EpisodeSelector from './EpisodeSelector';
import ServerManager from './ServerManager';
import styles from './AddEpisode.module.css';

const AddEpisode = () => {
  const { animeId: paramAnimeId } = useParams();
  const [animeId] = useState(paramAnimeId || '');
  const [episodeId, setEpisodeId] = useState('');
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [streamingServers, setStreamingServers] = useState([]);
  const [downloadServers, setDownloadServers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (animeId) {
      fetchEpisodes();
    } else {
      resetForm();
    }
  }, [animeId]);

  useEffect(() => {
    if (number && !title) {
      setTitle(`الحلقة ${number}`);
    }
  }, [number, title]);

  const fetchEpisodes = async () => {
    try {
      const episodesData = await fetchEpisodesByAnimeId(animeId);
      setAllEpisodes(episodesData);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      showSnackbar('Failed to fetch episodes', 'error');
    }
  };

  const resetForm = () => {
    setAllEpisodes([]);
    setEpisodeId('');
    setTitle('');
    setNumber('');
    setStreamingServers([]);
    setDownloadServers([]);
  };

  const handleEpisodeSelect = (selectedEpisodeId) => {
    const selectedEpisode = allEpisodes.find(ep => ep._id === selectedEpisodeId);
    if (selectedEpisode) {
      setEpisodeId(selectedEpisode._id);
      setTitle(selectedEpisode.title);
      setNumber(selectedEpisode.number);
      setStreamingServers(selectedEpisode.streamingServers);
      setDownloadServers(selectedEpisode.downloadServers);
    } else {
      resetForm();
    }
  };

  const handleQuickAdd = () => {
    const nextEpisodeNumber = allEpisodes.length + 1;
    setNumber(nextEpisodeNumber.toString());
    setTitle(`الحلقة ${nextEpisodeNumber}`);
    setStreamingServers([]);
    setDownloadServers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const episodeData = {
        animeId,
        title,
        number,
        streamingServers: streamingServers.map(server => ({
          serverName: server.serverName,
          type: server.type,
          quality: server.quality,
          url: server.url
        })),
        downloadServers: downloadServers.map(server => ({
          serverName: server.serverName,
          type: server.type,
          quality: server.quality,
          url: server.url
        }))
      };

      if (episodeId) {
        await updateEpisode(episodeId, episodeData);
        showSnackbar('Episode updated successfully', 'success');
      } else {
        await addEpisode(episodeData);
        showSnackbar('Episode added successfully', 'success');
      }
      await fetchEpisodes();
      resetForm();
    } catch (error) {
      console.error('Error saving episode:', error);
      showSnackbar('Error saving episode', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEpisode(episodeId);
      showSnackbar('Episode deleted successfully', 'success');
      resetForm();
      setOpenDeleteDialog(false);
      await fetchEpisodes();
    } catch (error) {
      console.error('Error deleting episode:', error);
      showSnackbar('Error deleting episode', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Paper className={styles.addEpisode}>
      <Typography variant="h6" className={styles.title}>Add, Edit, or Delete Episode</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Episode</InputLabel>
              <Select
                value={episodeId}
                onChange={(e) => handleEpisodeSelect(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>Select an episode</MenuItem>
                {allEpisodes.map((episode) => (
                  <MenuItem key={episode._id} value={episode._id}>
                    {episode.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="secondary"
              onClick={handleQuickAdd}
              fullWidth
            >
              Quick Add
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="Enter episode number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
              placeholder="Enter episode title"
            />
          </Grid>
          <Grid item xs={12}>
            <ServerManager
              streamingServers={streamingServers}
              setStreamingServers={setStreamingServers}
              downloadServers={downloadServers}
              setDownloadServers={setDownloadServers}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {episodeId ? 'Update Episode' : 'Add Episode'}
            </Button>
          </Grid>
          {episodeId && (
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpenDeleteDialog(true)}
                fullWidth
                startIcon={<Delete />}
              >
                Delete Episode
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Episode</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this episode? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddEpisode;