import React, { useState, useEffect } from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';

const AnimeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { animeList, loading, error, totalPages } = useFetchAnimeList(currentPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Ensure currentPage is always defined
    if (currentPage === undefined) {
      setCurrentPage(1);
    }
  }, [currentPage]);

  return (
    <Box sx={{ padding: '20px' }}>
      <ListDisplay
        title="Anime List"
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

export default AnimeList;