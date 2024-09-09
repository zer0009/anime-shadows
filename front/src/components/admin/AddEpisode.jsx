import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Paper, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Grid, MenuItem, Select, FormControl, InputLabel, Tabs, Tab, IconButton, Box } from '@mui/material';
import { Delete, Add, Edit, ArrowBack } from '@mui/icons-material';
import { addEpisode, updateEpisode, deleteEpisode } from '../../api/modules/admin';
import { fetchEpisodesByAnimeId } from '../../api/modules/anime';
import ServerManager from './ServerManager';
import styles from './AddEpisode.module.css';

const AddEpisode = () => {
  const { animeId: paramAnimeId } = useParams();
  const navigate = useNavigate();
  const [animeId] = useState(paramAnimeId || '');
  const [episodeId, setEpisodeId] = useState('');
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [streamingServers, setStreamingServers] = useState([]);
  const [downloadServers, setDownloadServers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [mode, setMode] = useState('add');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (animeId) fetchEpisodes();
  }, [animeId]);

  useEffect(() => {
    if (number && !title) setTitle(`الحلقة ${number}`);
  }, [number, title]);

  const fetchEpisodes = async () => {
    try {
      const episodesData = await fetchEpisodesByAnimeId(animeId);
      console.log('Fetched episodes:', JSON.stringify(episodesData, null, 2));
      setAllEpisodes(episodesData);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      showSnackbar('Failed to fetch episodes', 'error');
    }
  };

  const resetForm = () => {
    setEpisodeId('');
    setTitle('');
    setNumber('');
    setStreamingServers([]);
    setDownloadServers([]);
    setMode('add');
  };

  const handleEpisodeSelect = (selectedEpisodeId) => {
    console.log('Selected episode ID:', selectedEpisodeId);
    const selectedEpisode = allEpisodes.find(ep => ep._id === selectedEpisodeId);
    console.log('Selected episode:', selectedEpisode);
    if (selectedEpisode) {
      setEpisodeId(selectedEpisode._id);
      setTitle(selectedEpisode.title);
      setNumber(selectedEpisode.number);
      console.log('Setting streaming servers:', selectedEpisode.streamingServers);
      setStreamingServers(selectedEpisode.streamingServers || []);
      console.log('Setting download servers:', selectedEpisode.downloadServers);
      setDownloadServers(selectedEpisode.downloadServers || []);
      setMode('edit');
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
    setMode('add');
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
          url: server.url,
          subtitle: server.subtitle // Add this line
        })),
        downloadServers: downloadServers.map(server => ({
          serverName: server.serverName,
          type: server.type,
          quality: server.quality,
          url: server.url,
          subtitle: server.subtitle // Add this line
        }))
      };

      if (mode === 'edit') {
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Paper className={styles.addEpisode} elevation={0}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.title}>Manage Episodes</Typography>
        <IconButton onClick={handleGoBack} className={styles.backButton}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
        <Tab label="Add/Edit Episode" />
        <Tab label="Episode List" />
      </Tabs>
      {tabValue === 0 && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                startIcon={mode === 'add' ? <Add /> : <Edit />}
                variant="contained"
                color="primary"
                onClick={handleQuickAdd}
                fullWidth
                size="small"
              >
                {mode === 'add' ? 'Quick Add New Episode' : 'Switch to Add Mode'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter episode number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                size="small"
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
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="small">
                {mode === 'edit' ? 'Update Episode' : 'Add Episode'}
              </Button>
            </Grid>
            {mode === 'edit' && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenDeleteDialog(true)}
                  fullWidth
                  startIcon={<Delete />}
                  size="small"
                >
                  Delete Episode
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      )}
      {tabValue === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Select Episode to Edit</InputLabel>
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
        </Grid>
      )}
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