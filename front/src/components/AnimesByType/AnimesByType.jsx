import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useFetchAnimesByType from '../../hooks/useFetchAnimesByType';
import ListDisplay from '../ListDisplay/ListDisplay';

const AnimesByType = ({ typeId }) => {
  const { animes, loading, error } = useFetchAnimesByType(typeId);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!animes || animes.length === 0) {
    return <Typography>No animes found for this type.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">Animes</Typography>
      <ListDisplay
        title="Animes"
        list={animes}
        fields={['title', 'description', 'myAnimeListRating']}
      />
    </Box>
  );
};

export default AnimesByType;