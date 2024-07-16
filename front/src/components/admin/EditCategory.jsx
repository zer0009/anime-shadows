import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { editCategory } from '../../api/modules/admin';

const EditCategory = () => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editCategory(categoryId, { name });
      alert('Category edited successfully');
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">Edit Category</Button>
      </form>
    </div>
  );
};

export default EditCategory;