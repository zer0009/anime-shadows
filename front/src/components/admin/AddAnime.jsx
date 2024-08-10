import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, Typography, CircularProgress, Snackbar, Grid, Paper } from '@mui/material';
import { addAnime, scrapeAnime } from '../../api/modules/admin';
import { fetchGenre, fetchTypes, fetchSeasons } from '../../api/modules/anime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

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

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching data:', error);
        setSnackbar({ open: true, message: 'Failed to load form data', severity: 'error' });
      }
    };
    fetchData();
  }, []);

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
    if (!status) return ''; // Return empty string if status is null or undefined
    if (status.includes('Finished Airing')) return 'completed';
    if (status.includes('Currently Airing')) return 'ongoing';
    if (status.includes('Not yet aired')) return 'upcoming';
    return ''; // Return empty string for any other status
  };

  const handleFetchFromMAL = async () => {
    if (animeData.myAnimeListUrl) {
      setLoading(true);
      try {
        const response = await scrapeAnime(animeData.myAnimeListUrl);
        const scrapedData = response.data;
        console.log(scrapedData);

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

        setSnackbar({ open: true, message: 'Data fetched successfully', severity: 'success' });
      } catch (error) {
        console.error('Error fetching from MAL:', error);
        setSnackbar({ open: true, message: 'Failed to fetch data from MyAnimeList', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in animeData) {
        if (key === 'genres') {
          formData.append(key, JSON.stringify(animeData[key]));
        } else if (key === 'airingDate' && animeData[key]) {
          formData.append(key, animeData[key].toISOString());
        } else if (key === 'pictureUrl') {
          // Ensure pictureUrl is a string, not an array
          formData.append(key, Array.isArray(animeData[key]) ? animeData[key][0] : animeData[key]);
        } else {
          formData.append(key, animeData[key]);
        }
      }
      if (file) {
        formData.append('image', file);
      }
      await addAnime(formData);
      setSnackbar({ open: true, message: 'Anime added successfully', severity: 'success' });
      setAnimeData({
        title: '', subTitle: '', studio: '', description: '', seasonId: '',
        myAnimeListUrl: '', typeId: '', genres: [], numberOfEpisodes: '',
        source: '', duration: '', status: '', airingDate: null, pictureUrl: ''
      });
      setFile(null);
    } catch (error) {
      console.error('Error adding anime:', error);
      setSnackbar({ open: true, message: 'Failed to add anime', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getGenreNames = (selectedIds) => {
    return selectedIds.map(id => {
      const genre = genres.find(g => g._id === id);
      return genre ? genre.name: '';
    }).filter(Boolean).join(', ');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Add New Anime</Typography>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>Fetch from MyAnimeList</Typography>
        <TextField
          name="myAnimeListUrl"
          label="MyAnimeList URL"
          value={animeData.myAnimeListUrl}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleFetchFromMAL} disabled={loading} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
        </Button>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="title"
            label="Title"
            value={animeData.title}
            onChange={handleInputChange}
            required
            fullWidth
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
            multiline
            rows={4}
            required
            fullWidth
            margin="normal"
          />
        </Grid>
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
                <MenuItem key={season._id} value={season._id}>{season.name} {season.year}</MenuItem>
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
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {file && <Typography variant="body2">{file.name}</Typography>}
        </Grid>
        {(animeData.pictureUrl || file) && (
          <Grid item xs={12}>
            <img 
              src={file ? URL.createObjectURL(file) : animeData.pictureUrl} 
              alt="Anime preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
            />
          </Grid>
        )}
      </Grid>

      <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ marginTop: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Add Anime'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default AddAnime;