import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnimesByGenre } from '../api/modules/anime';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography } from '@mui/material';

const GenreList = () => {
  const { genreId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchAnimesByGenre(genreId, currentPage);
        setAnimeList(response.animes);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError('Error fetching anime by genre');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Anime by Genre
      </Typography>
      <ListDisplay
        title="Anime by Genre"
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

export default GenreList;