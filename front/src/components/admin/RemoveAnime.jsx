import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { removeAnime } from '../../api/modules/admin';

const RemoveAnime = () => {
  const [animeId, setAnimeId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await removeAnime(animeId);
      alert('Anime removed successfully');
    } catch (error) {
      console.error('Error removing anime:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Remove Anime</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Anime ID"
          value={animeId}
          onChange={(e) => setAnimeId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Remove Anime</Button>
      </form>
    </div>
  );
};

export default RemoveAnime;