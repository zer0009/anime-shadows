import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';
import styles from './AnimeList.module.css';

const AnimeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage);
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page });
  }, [setSearchParams]);

  return (
    <Box sx={{ padding: '20px', backgroundColor: 'var(--primary-dark)', color: 'var(--text-color)' }}>
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