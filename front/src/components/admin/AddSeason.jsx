import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addSeason, editSeason, deleteSeason } from '../../api/modules/admin';
import { fetchSeasons } from '../../api/modules/anime';
import styles from './AddSeason.module.css';

const AddSeason = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSeasonId, setCurrentSeasonId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);

  useEffect(() => {
    const loadSeasons = async () => {
      const seasonsData = await fetchSeasons();
      setSeasons(seasonsData);
    };
    loadSeasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const seasonData = { 
        name, 
        year, 
        startDate: startDate ? startDate.toISOString() : null, // Convert date to ISO string
        endDate: endDate ? endDate.toISOString() : null // Convert date to ISO string
      };
      console.log('Submitting season data:', seasonData); // Add this line
      if (editMode) {
        await editSeason(currentSeasonId, seasonData);
        alert('Season updated successfully');
      } else {
        await addSeason(seasonData);
        alert('Season added successfully');
      }
      setName('');
      setYear('');
      setStartDate(null);
      setEndDate(null);
      setEditMode(false);
      setCurrentSeasonId(null);
      const seasonsData = await fetchSeasons();
      setSeasons(seasonsData);
    } catch (error) {
      console.error('Error adding/updating season:', error);
    }
  };

  const handleEdit = (season) => {
    setName(season.name);
    setYear(season.year);
    setStartDate(dayjs(season.startDate));
    setEndDate(dayjs(season.endDate));
    setEditMode(true);
    setCurrentSeasonId(season._id);
  };

  const handleDelete = async () => {
    try {
      await deleteSeason(seasonToDelete._id);
      alert('Season deleted successfully');
      setOpenDeleteDialog(false);
      const seasonsData = await fetchSeasons();
      setSeasons(seasonsData);
    } catch (error) {
      console.error('Error deleting season:', error);
    }
  };

  const openDeleteConfirmation = (season) => {
    setSeasonToDelete(season);
    setOpenDeleteDialog(true);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  return (
    <div className={styles.container}>
      <Typography variant="h6">{editMode ? 'Edit Season' : 'Add Season'}</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fullWidth
          margin="normal"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
        <Button type="submit" variant="contained" color="primary">
          {editMode ? 'Update Season' : 'Add Season'}
        </Button>
      </form>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seasons.map((season) => (
              <TableRow key={season._id}>
                <TableCell>{season.name}</TableCell>
                <TableCell>{season.year}</TableCell>
                <TableCell>{new Date(season.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(season.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(season)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => openDeleteConfirmation(season)}>
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
        <DialogTitle>Delete Season</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this season? This action cannot be undone.
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

export default AddSeason;