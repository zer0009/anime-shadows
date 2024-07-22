import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AnimeSelector = ({ animeId, setAnimeId, allAnimes }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Anime</InputLabel>
      <Select
        value={animeId}
        onChange={(e) => setAnimeId(e.target.value)}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {allAnimes.map((anime) => (
          <MenuItem key={anime._id} value={anime._id}>
            {anime.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AnimeSelector;
