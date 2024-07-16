import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';

const EpisodeSelector = ({ episodeId, setEpisodeId, title, setTitle, number, setNumber, allEpisodes }) => {
  const handleEpisodeChange = (e) => {
    const selectedEpisode = allEpisodes.find(ep => ep._id === e.target.value);
    setEpisodeId(e.target.value);
    setTitle(selectedEpisode ? selectedEpisode.title : '');
    setNumber(selectedEpisode ? selectedEpisode.number : '');
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Episode</InputLabel>
        <Select
          value={episodeId}
          onChange={handleEpisodeChange}
        >
          <MenuItem value="">
            <em>Create New Episode</em>
          </MenuItem>
          {allEpisodes.map((episode) => (
            <MenuItem key={episode._id} value={episode._id}>
              {`Episode ${episode.number}: ${episode.title}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default EpisodeSelector;