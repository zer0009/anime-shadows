import React, { useState, useEffect } from 'react';
import { fetchPopularAnime } from '../api/modules/anime';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography } from '@mui/material';

const PopularAnime = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPopularAnime(currentPage);
        console.log(response);
        setAnimeList(response.sortedAnimes || []); // Ensure animeList is always an array
        setTotalPages(response.totalPages);
      } catch (error) {
        setError('Error fetching popular anime');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Popular Anime
      </Typography>
      <ListDisplay
        title="Popular Anime"
        list={animeList}
        loading={loading}
        error={error}
        fields={['title', 'genre', 'rating']}
      />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default PopularAnime;