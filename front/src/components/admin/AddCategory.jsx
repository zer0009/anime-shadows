import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { addCategory } from '../../api/modules/admin';

const AddCategory = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ name });
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Add Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Add Category</Button>
      </form>
    </div>
  );
};

export default AddCategory;