import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import { addAnime } from '../../api/modules/admin';
import { fetchGenre, fetchTypes, fetchSeasons } from '../../api/modules/anime';

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
  const [allGenres, setAllGenres] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);

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
    formData.append('genres', JSON.stringify(genres));
    formData.append('seasonId', seasonId);
    formData.append('myAnimeListUrl', myAnimeListUrl);
    formData.append('numberOfEpisodes', numberOfEpisodes);
    formData.append('source', source);
    formData.append('duration', duration);
    formData.append('status', status);
    if (image) {
      formData.append('file', image);
    }

    console.log('Form Data:', Object.fromEntries(formData.entries()));

    try {
      await addAnime(formData);
      alert('Anime added successfully');
    } catch (error) {
      console.error('Error adding anime:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Add Anime</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
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
        />
        <TextField
          label="Number of Episodes"
          value={numberOfEpisodes}
          onChange={(e) => setNumberOfEpisodes(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          fullWidth
          margin="normal"
        />
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
        <Button type="submit" variant="contained" color="primary">Add Anime</Button>
      </form>
    </div>
  );
};

export default AddAnime;