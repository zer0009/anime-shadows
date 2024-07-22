import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { fetchAnimeById, fetchGenre, fetchTypes, fetchSeasons } from '../../api/modules/anime';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditAnime.module.css';
import { editAnime } from '../../api/modules/admin';

const EditAnime = () => {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [title, setTitle] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [type, setType] = useState('');
  const [genres, setGenres] = useState([]);
  const [season, setSeason] = useState(''); // Change seasonId to season
  const [myAnimeListUrl, setMyAnimeListUrl] = useState('');
  const [numberOfEpisodes, setNumberOfEpisodes] = useState('');
  const [source, setSource] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [allGenres, setAllGenres] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);

  useEffect(() => {
    const loadAnime = async () => {
      const data = await fetchAnimeById(animeId);
      setAnime(data);
      setTitle(data.title);
      setPictureUrl(data.pictureUrl);
      setType(data.type._id); // Ensure type is set correctly
      setGenres(data.genres.map(genre => genre._id)); // Ensure genres are in the correct format
      setSeason(data.season._id); // Ensure season is set correctly
      setMyAnimeListUrl(data.myAnimeListUrl);
      setNumberOfEpisodes(data.numberOfEpisodes);
      setSource(data.source);
      setDuration(data.duration);
      setStatus(data.status);
    };
    const loadMetadata = async () => {
      const genresData = await fetchGenre();
      const typesData = await fetchTypes();
      const seasonsData = await fetchSeasons();
      setAllGenres(genresData);
      setAllTypes(typesData);
      setAllSeasons(seasonsData);
    };
    loadAnime();
    loadMetadata();
  }, [animeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const animeData = {
        title,
        pictureUrl,
        type,
        genres,
        season, // Change seasonId to season
        myAnimeListUrl,
        numberOfEpisodes,
        source,
        duration,
        status
      };
      console.log('Sending update data:', animeData); // Add this line to log the sent data
      await editAnime(animeId, animeData);
      alert('Anime edited successfully');
      navigate('/admin/manage-anime');
    } catch (error) {
      console.error('Error editing anime:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Edit Anime</Typography>
      {anime && (
        <Paper className={styles.paper}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
              fullWidth
              margin="normal"
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
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Season</InputLabel>
              <Select
                value={season} // Change seasonId to season
                onChange={(e) => setSeason(e.target.value)} // Change setSeasonId to setSeason
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
            <Button type="submit" variant="contained" color="primary" fullWidth className={styles.submitButton}>
              Save Changes
            </Button>
          </form>
        </Paper>
      )}
    </div>
  );
};

export default EditAnime;