import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, Box, Paper } from '@mui/material';
import { addAnime } from '../../api/modules/admin';
import { fetchGenre, fetchTypes, fetchSeasons } from '../../api/modules/anime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from './AddAnime.module.css';

const AddAnime = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [type, setType] = useState('');
  const [genres, setGenres] = useState([]);
  const [seasonId, setSeasonId] = useState('');
  const [myAnimeListUrl, setMyAnimeListUrl] = useState('');
  const [numberOfEpisodes, setNumberOfEpisodes] = useState('');
  const [source, setSource] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [airingDate, setAiringDate] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const genresData = await fetchGenre();
      const typesData = await fetchTypes();
      const seasonsData = await fetchSeasons();
      setAllGenres(genresData);
      setAllTypes(typesData);
      setAllSeasons(seasonsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('typeId', type);
    formData.append('genres', JSON.stringify(genres)); // Ensure genres is a JSON string
    formData.append('seasonId', seasonId);
    formData.append('myAnimeListUrl', myAnimeListUrl);
    formData.append('numberOfEpisodes', numberOfEpisodes);
    formData.append('source', source);
    formData.append('duration', duration);
    formData.append('status', status);
    formData.append('airingDate', airingDate ? airingDate.toISOString() : null);
    if (image) {
      formData.append('file', image);
    }

    // Debugging line to log form data
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await addAnime(formData);
      alert('Anime added successfully');
      setError('');
    } catch (error) {
      setError('Error adding anime');
      console.error('Error adding anime:', error);
    }
  };

  return (
    <Paper className={styles.paper}>
      <Typography variant="h6" className={styles.title}>Add Anime</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter anime title"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Enter anime description"
        />
        <Box margin="normal">
          <Button
            variant="contained"
            component="label"
            fullWidth
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
        </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {allTypes.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            renderValue={(selected) => selected.map(id => allGenres.find(genre => genre._id === id)?.name).join(', ')}
          >
            {allGenres.map((genre) => (
              <MenuItem key={genre._id} value={genre._id}>
                <Checkbox checked={genres.indexOf(genre._id) > -1} />
                <ListItemText primary={genre.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Season</InputLabel>
          <Select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
          >
            {allSeasons.map((season) => (
              <MenuItem key={season._id} value={season._id}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="MyAnimeList URL"
          value={myAnimeListUrl}
          onChange={(e) => setMyAnimeListUrl(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter MyAnimeList URL"
        />
        <TextField
          label="Number of Episodes"
          value={numberOfEpisodes}
          onChange={(e) => setNumberOfEpisodes(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter number of episodes"
        />
        <TextField
          label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter source"
        />
        <TextField
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter duration in minutes"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Airing Date"
            value={airingDate}
            onChange={(date) => setAiringDate(date ? dayjs(date) : null)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
          </Select>
        </FormControl>
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
          Add Anime
        </Button>
      </form>
    </Paper>
  );
};

export default AddAnime;