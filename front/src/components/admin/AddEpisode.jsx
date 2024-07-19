import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box, Paper, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
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
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    if (animeId) {
      const fetchEpisodes = async () => {
        const episodesData = await fetchEpisodesByAnimeId(animeId);
        setAllEpisodes(episodesData);
      };
      fetchEpisodes();
    } else {
      setAllEpisodes([]);
      setEpisodeId('');
      setTitle('');
      setNumber('');
    }
  }, [animeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (episodeId) {
        await updateEpisode(episodeId, { animeId, title, number, streamingServers, downloadServers });
        alert('Episode updated successfully');
      } else {
        await addEpisode({ animeId, title, number, streamingServers, downloadServers });
        alert('Episode added successfully');
      }
    } catch (error) {
      console.error('Error saving episode:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEpisode(episodeId);
      alert('Episode deleted successfully');
      setEpisodeId('');
      setTitle('');
      setNumber('');
      setStreamingServers([]);
      setDownloadServers([]);
      setOpenDeleteDialog(false);
      const episodesData = await fetchEpisodesByAnimeId(animeId);
      setAllEpisodes(episodesData);
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  };

  const handleEditOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <Paper className={styles.addEpisode}>
      <Typography variant="h6" className={styles.title}>Add, Edit, or Delete Episode</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <EpisodeSelector
          episodeId={episodeId}
          setEpisodeId={setEpisodeId}
          title={title}
          setTitle={setTitle}
          number={number}
          setNumber={setNumber}
          allEpisodes={allEpisodes}
        />
        {!episodeId && (
          <>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter episode title"
            />
            <TextField
              label="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter episode number"
            />
          </>
        )}
        <ServerManager
          streamingServers={streamingServers}
          setStreamingServers={setStreamingServers}
          downloadServers={downloadServers}
          setDownloadServers={setDownloadServers}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Episode
          </Button>
          {episodeId && (
            <>
              <IconButton color="secondary" onClick={() => setOpenDeleteDialog(true)}>
                <Delete />
              </IconButton>
              <IconButton color="primary" onClick={handleEditOpen}>
                <Edit />
              </IconButton>
            </>
          )}
        </Box>
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
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
      >
        <DialogTitle>Edit Episode</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter episode title"
            />
            <TextField
              label="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter episode number"
            />
            <ServerManager
              streamingServers={streamingServers}
              setStreamingServers={setStreamingServers}
              downloadServers={downloadServers}
              setDownloadServers={setDownloadServers}
            />
            <DialogActions>
              <Button onClick={handleEditClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default AddEpisode;