import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { editEpisode } from '../../api/modules/admin';

const EditEpisode = () => {
  const [episodeId, setEpisodeId] = useState('');
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editEpisode(episodeId, { title, number });
      alert('Episode edited successfully');
    } catch (error) {
      console.error('Error editing episode:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Episode</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Episode ID"
          value={episodeId}
          onChange={(e) => setEpisodeId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Edit Episode</Button>
      </form>
    </div>
  );
};

export default EditEpisode;