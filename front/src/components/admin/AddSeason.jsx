import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, Snackbar, Alert, FormControl, InputLabel } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addSeason, editSeason, deleteSeason } from '../../api/modules/admin';
import { fetchSeasons } from '../../api/modules/anime';
import styles from './AddSeason.module.css';

const AddSeason = () => {
  const [seasonData, setSeasonData] = useState({
    name: '',
    year: '',
    startDate: null,
    endDate: null
  });
  const [seasons, setSeasons] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSeasonId, setCurrentSeasonId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = async () => {
    try {
      const seasonsData = await fetchSeasons();
      setSeasons(seasonsData);
    } catch (error) {
      console.error('Error loading seasons:', error);
      showSnackbar('Failed to load seasons', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeasonData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setSeasonData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...seasonData,
        startDate: seasonData.startDate ? seasonData.startDate.toISOString() : null,
        endDate: seasonData.endDate ? seasonData.endDate.toISOString() : null
      };

      if (editMode) {
        await editSeason(currentSeasonId, submissionData);
        showSnackbar('Season updated successfully', 'success');
      } else {
        await addSeason(submissionData);
        showSnackbar('Season added successfully', 'success');
      }

      resetForm();
      loadSeasons();
    } catch (error) {
      console.error('Error adding/updating season:', error);
      showSnackbar('Failed to add/update season', 'error');
    }
  };

  const handleEdit = (season) => {
    setSeasonData({
      name: season.name,
      year: season.year,
      startDate: dayjs(season.startDate),
      endDate: dayjs(season.endDate)
    });
    setEditMode(true);
    setCurrentSeasonId(season._id);
  };

  const handleDelete = async () => {
    try {
      await deleteSeason(seasonToDelete._id);
      showSnackbar('Season deleted successfully', 'success');
      setOpenDeleteDialog(false);
      loadSeasons();
    } catch (error) {
      console.error('Error deleting season:', error);
      showSnackbar('Failed to delete season', 'error');
    }
  };

  const openDeleteConfirmation = (season) => {
    setSeasonToDelete(season);
    setOpenDeleteDialog(true);
  };

  const resetForm = () => {
    setSeasonData({ name: '', year: '', startDate: null, endDate: null });
    setEditMode(false);
    setCurrentSeasonId(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>{editMode ? 'Edit Season' : 'Add Season'}</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Name"
          name="name"
          value={seasonData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            label="Year"
            name="year"
            value={seasonData.year}
            onChange={handleInputChange}
            required
          >
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={seasonData.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <DatePicker
            label="End Date"
            value={seasonData.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
        <Box className={styles.buttonContainer}>
          <Button type="submit" variant="contained" color="primary" startIcon={editMode ? <Edit /> : <Add />}>
            {editMode ? 'Update Season' : 'Add Season'}
          </Button>
          {editMode && (
            <Button onClick={resetForm} variant="outlined" color="secondary">
              Cancel Edit
            </Button>
          )}
        </Box>
      </form>
      <TableContainer className={styles.tableContainer}>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddSeason;