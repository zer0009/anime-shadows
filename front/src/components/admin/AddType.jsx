import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { addType } from '../../api/modules/admin';

const AddType = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addType({ name });
      alert('Type added successfully');
    } catch (error) {
      console.error('Error adding type:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Add Type</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Add Type</Button>
      </form>
    </div>
  );
};

export default AddType;