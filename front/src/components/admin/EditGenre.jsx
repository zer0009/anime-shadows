import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { editGenre } from '../../api/modules/admin';

const EditGenre = () => {
  const [genreId, setGenreId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editGenre(genreId, { name });
      alert('Genre edited successfully');
    } catch (error) {
      console.error('Error editing genre:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Genre</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Genre ID"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Edit Genre</Button>
      </form>
    </div>
  );
};

export default EditGenre;