import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { addGenre, editGenre, deleteGenre } from '../../api/modules/admin';
import { fetchGenre } from '../../api/modules/anime';
import styles from './AddGenre.module.css';

const AddGenre = () => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentGenreId, setCurrentGenreId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      const genresData = await fetchGenre();
      setGenres(genresData);
    };
    loadGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await editGenre(currentGenreId, { name });
        alert('Genre updated successfully');
      } else {
        await addGenre({ name });
        alert('Genre added successfully');
      }
      setName('');
      setEditMode(false);
      setCurrentGenreId(null);
      const genresData = await fetchGenre();
      setGenres(genresData);
    } catch (error) {
      console.error('Error adding/updating genre:', error);
    }
  };

  const handleEdit = (genre) => {
    setName(genre.name);
    setEditMode(true);
    setCurrentGenreId(genre._id);
  };

  const handleDelete = async () => {
    try {
      await deleteGenre(genreToDelete._id);
      alert('Genre deleted successfully');
      setOpenDeleteDialog(false);
      const genresData = await fetchGenre();
      setGenres(genresData);
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const openDeleteConfirmation = (genre) => {
    setGenreToDelete(genre);
    setOpenDeleteDialog(true);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h6">{editMode ? 'Edit Genre' : 'Add Genre'}</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {editMode ? 'Update Genre' : 'Add Genre'}
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
            {genres.map((genre) => (
              <TableRow key={genre._id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(genre)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => openDeleteConfirmation(genre)}>
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
        <DialogTitle>Delete Genre</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this genre? This action cannot be undone.
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

export default AddGenre;