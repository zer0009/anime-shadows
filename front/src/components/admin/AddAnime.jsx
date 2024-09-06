import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, Typography, CircularProgress, Snackbar, Grid, Paper, Tabs, Tab, Alert, IconButton } from '@mui/material';
import { AddPhotoAlternate, Link as LinkIcon } from '@mui/icons-material';
import { addAnime, scrapeAnime } from '../../api/modules/admin';
import { fetchGenre, fetchTypes, fetchSeasons } from '../../api/modules/anime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from './AddAnime.module.css';

const AddAnime = () => {
  const [animeData, setAnimeData] = useState({
    title: '', subTitle: '', studio: '', description: '', seasonId: '',
    myAnimeListUrl: '', typeId: '', genres: [], numberOfEpisodes: '',
    source: '', duration: '', status: '', airingDate: null, pictureUrl: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [types, setTypes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [genresData, typesData, seasonsData] = await Promise.all([
        fetchGenre(),
        fetchTypes(),
        fetchSeasons()
      ]);
      setGenres(genresData);
      setTypes(typesData);
      setSeasons(seasonsData);
    } catch (error) {
      console.error('Error fetching form data:', error);
      showSnackbar('Failed to load form data', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnimeData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setAnimeData(prev => ({ ...prev, airingDate: date }));
  };

  const handleGenreChange = (event) => {
    setAnimeData(prev => ({ ...prev, genres: event.target.value }));
  };

  const mapStatus = (status) => {
    if (!status) return '';
    if (status.includes('Finished Airing')) return 'completed';
    if (status.includes('Currently Airing')) return 'ongoing';
    if (status.includes('Not yet aired')) return 'upcoming';
    return '';
  };

  const handleFetchFromMAL = async () => {
    if (animeData.myAnimeListUrl) {
      setLoading(true);
      try {
        const response = await scrapeAnime(animeData.myAnimeListUrl);
        const scrapedData = response.data;
        updateAnimeDataFromScrapedData(scrapedData);
        showSnackbar('Data fetched successfully', 'success');
      } catch (error) {
        console.error('Error fetching from MAL:', error);
        showSnackbar('Failed to fetch data from MyAnimeList', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateAnimeDataFromScrapedData = (scrapedData) => {
    setAnimeData(prev => ({
      ...prev,
      title: scrapedData.title || '',
      subTitle: scrapedData.subTitle || '',
      description: scrapedData.synopsis || '',
      numberOfEpisodes: scrapedData.numberOfEpisodes || '',
      status: mapStatus(scrapedData.status || ''),
      airingDate: scrapedData.airingDate && scrapedData.airingDate.start ? dayjs(scrapedData.airingDate.start) : null,
      studio: scrapedData.studio || '',
      source: scrapedData.source || '',
      duration: scrapedData.duration || '',
      pictureUrl: scrapedData.pictureUrl || '',
      genres: (scrapedData.genres || []).map(genre => {
        const foundGenre = genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
        return foundGenre ? foundGenre._id : null;
      }).filter(id => id !== null)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(animeData).forEach(([key, value]) => {
        if (key === 'genres') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'airingDate' && value) {
          formData.append(key, value.toISOString());
        } else if (key === 'pictureUrl') {
          formData.append(key, Array.isArray(value) ? value[0] : value);
        } else {
          formData.append(key, value);
        }
      });
      if (file) {
        formData.append('image', file);
      }
      await addAnime(formData);
      showSnackbar('Anime added successfully', 'success');
      resetForm();
    } catch (error) {
      console.error('Error adding anime:', error);
      showSnackbar('Failed to add anime', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAnimeData({
      title: '', subTitle: '', studio: '', description: '', seasonId: '',
      myAnimeListUrl: '', typeId: '', genres: [], numberOfEpisodes: '',
      source: '', duration: '', status: '', airingDate: null, pictureUrl: ''
    });
    setFile(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getGenreNames = (selectedIds) => {
    return selectedIds.map(id => {
      const genre = genres.find(g => g._id === id);
      return genre ? genre.name: '';
    }).filter(Boolean).join(', ');
  };

  const renderBasicInfo = () => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          name="title"
          label="Title"
          value={animeData.title}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="subTitle"
          label="Sub Title"
          value={animeData.subTitle}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="description"
          label="Description"
          value={animeData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </Grid>
    </>
  );

  const renderAdditionalInfo = () => (
    <>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Season</InputLabel>
          <Select
            name="seasonId"
            value={animeData.seasonId}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="">Select a season</MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season._id} value={season._id}>{`${season.name} ${season.year}`}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            name="typeId"
            value={animeData.typeId}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="">Select a type</MenuItem>
            {types.map((type) => (
              <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            name="genres"
            value={animeData.genres}
            onChange={handleGenreChange}
            renderValue={(selected) => getGenreNames(selected)}
          >
            {genres.map(genre => (
              <MenuItem key={genre._id} value={genre._id}>
                <Checkbox checked={animeData.genres.indexOf(genre._id) > -1} />
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );

  const renderDetailsInfo = () => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          name="numberOfEpisodes"
          label="Number of Episodes"
          type="number"
          value={animeData.numberOfEpisodes}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="duration"
          label="Duration"
          value={animeData.duration}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="studio"
          label="Studio"
          value={animeData.studio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="source"
          label="Source"
          value={animeData.source}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={animeData.status}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="">Select a status</MenuItem>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Airing Date"
            value={animeData.airingDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
      </Grid>
    </>
  );

  const renderImageUpload = () => (
    <>
      <Grid item xs={12}>
        <TextField
          name="pictureUrl"
          label="Picture URL"
          value={animeData.pictureUrl}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <input
          accept="image/*"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'none' }}
          id="raised-button-file"
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="outlined"
            component="span"
            startIcon={<AddPhotoAlternate />}
            className={styles.imageUploadButton}
          >
            Upload Image
          </Button>
        </label>
        {file && <Typography variant="body2" style={{ marginTop: '0.5rem' }}>{file.name}</Typography>}
      </Grid>
      {(animeData.pictureUrl || file) && (
        <Grid item xs={12}>
          <img 
            src={file ? URL.createObjectURL(file) : animeData.pictureUrl} 
            alt="Anime preview" 
            className={styles.previewImage}
          />
        </Grid>
      )}
    </>
  );

  return (
    <Box className={styles.addAnime}>
      <Typography variant="h4" gutterBottom className={styles.title}>Add New Anime</Typography>

      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.malFetch}>
          <TextField
            name="myAnimeListUrl"
            label="MyAnimeList URL"
            value={animeData.myAnimeListUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <IconButton onClick={handleFetchFromMAL} disabled={loading}>
                  <LinkIcon color="primary" />
                </IconButton>
              ),
            }}
          />
          <Button 
            onClick={handleFetchFromMAL} 
            variant="contained" 
            color="primary" 
            disabled={loading}
            className={styles.fetchButton}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} className={styles.paper}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)} 
          variant="fullWidth"
          className={styles.tabs}
        >
          <Tab label="Basic Info" />
          <Tab label="Additional Info" />
          <Tab label="Details" />
          <Tab label="Image" />
        </Tabs>
        <Box className={styles.tabContent}>
          <Grid container spacing={3}>
            {tabValue === 0 && renderBasicInfo()}
            {tabValue === 1 && renderAdditionalInfo()}
            {tabValue === 2 && renderDetailsInfo()}
            {tabValue === 3 && renderImageUpload()}
          </Grid>
        </Box>
      </Paper>

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        disabled={loading} 
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress size={24} /> : 'Add Anime'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAnime;