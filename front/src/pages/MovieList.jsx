import React, { useState, useEffect } from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';

const MovieList = () => {
    const { animeList, loading, error, totalPages } = useFetchAnimeList();
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
      useEffect(() => {
        // Ensure currentPage is always defined
        if (currentPage === undefined) {
          setCurrentPage(1);
        }
      }, [currentPage]);

    // Filter the anime list to include only movies
    const movieList = animeList.filter(anime => anime.type && anime.type.name.toLowerCase() === 'movie');

    return (
        <Box sx={{ padding: '20px' }}>
        <ListDisplay
            title="Movie List"
            list={movieList}
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

export default MovieList;