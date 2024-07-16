import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { editAnime } from '../../api/modules/admin';

const EditAnime = () => {
  const [animeId, setAnimeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editAnime(animeId, { title, description, imageUrl });
      alert('Anime edited successfully');
    } catch (error) {
      console.error('Error editing anime:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Anime</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Anime ID"
          value={animeId}
          onChange={(e) => setAnimeId(e.target.value)}
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
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Edit Anime</Button>
      </form>
    </div>
  );
};

export default EditAnime;