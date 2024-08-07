import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const EpisodeSelector = ({ episodeId, setEpisodeId, allEpisodes }) => {
  const handleEpisodeChange = (e) => {
    const selectedEpisodeId = e.target.value;
    setEpisodeId(selectedEpisodeId);
  };

  return (
    <Box>
      <FormControl fullWidth margin="dense">
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
              {episode.title} (Episode {episode.number})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default EpisodeSelector;