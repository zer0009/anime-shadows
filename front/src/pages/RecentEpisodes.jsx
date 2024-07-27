import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import styles from './RecentEpisodes.module.css'; // Assuming you have a CSS module for styling

const RecentEpisodes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { recentEpisodes, loading, error, totalPages } = useFetchRecentEpisodes(currentPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Recently Updated Episodes
      </Typography>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <Grid container spacing={1} className={styles.grid}>
          {Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
            <Grid item xs={12} sm={6} md={4} lg={2.2} key={episode._id}>
              <AnimeCard
                anime={episode.anime}
                episodeTitle={episode.title}
                onClick={() => {
                  console.log(`Clicked on episode with id: ${episode.anime._id}`);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default RecentEpisodes;