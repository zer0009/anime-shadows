import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { addType, editType, deleteType } from '../../api/modules/admin';
import { fetchTypes } from '../../api/modules/anime';
import styles from './AddType.module.css';

const AddType = () => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentTypeId, setCurrentTypeId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  useEffect(() => {
    const loadTypes = async () => {
      const typesData = await fetchTypes();
      setTypes(typesData);
    };
    loadTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await editType(currentTypeId, { name });
        alert('Type updated successfully');
      } else {
        await addType({ name });
        alert('Type added successfully');
      }
      setName('');
      setEditMode(false);
      setCurrentTypeId(null);
      const typesData = await fetchTypes();
      setTypes(typesData);
    } catch (error) {
      console.error('Error adding/updating type:', error);
    }
  };

  const handleEdit = (type) => {
    setName(type.name);
    setEditMode(true);
    setCurrentTypeId(type._id);
  };

  const handleDelete = async () => {
    try {
      await deleteType(typeToDelete._id);
      alert('Type deleted successfully');
      setOpenDeleteDialog(false);
      const typesData = await fetchTypes();
      setTypes(typesData);
    } catch (error) {
      console.error('Error deleting type:', error);
    }
  };

  const openDeleteConfirmation = (type) => {
    setTypeToDelete(type);
    setOpenDeleteDialog(true);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h6">{editMode ? 'Edit Type' : 'Add Type'}</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {editMode ? 'Update Type' : 'Add Type'}
        </Button>
      </form>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type._id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(type)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => openDeleteConfirmation(type)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this type? This action cannot be undone.
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
    </div>
  );
};

export default AddType;