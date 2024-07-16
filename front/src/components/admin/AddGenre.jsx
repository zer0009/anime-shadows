import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { addGenre } from '../../api/modules/admin';

const AddGenre = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGenre({ name });
      alert('Genre added successfully');
    } catch (error) {
      console.error('Error adding genre:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Add Genre</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Add Genre</Button>
      </form>
    </div>
  );
};

export default AddGenre;