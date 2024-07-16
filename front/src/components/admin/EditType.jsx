import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { editType } from '../../api/modules/admin';

const EditType = () => {
  const [typeId, setTypeId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editType(typeId, { name });
      alert('Type edited successfully');
    } catch (error) {
      console.error('Error editing type:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Type</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Type ID"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">Edit Type</Button>
      </form>
    </div>
  );
};

export default EditType;