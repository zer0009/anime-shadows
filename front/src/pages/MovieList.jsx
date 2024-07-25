import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchMovieList from '../hooks/useFetchMovieList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';

const MovieList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const { movieList, loading, error, totalPages } = useFetchMovieList(currentPage);

    const handlePageChange = useCallback((page) => {
        setSearchParams({ page });
    }, [setSearchParams]);

    useEffect(() => {
        // Ensure currentPage is always defined
        if (currentPage === undefined) {
            setSearchParams({ page: 1 });
        }
    }, [currentPage, setSearchParams]);

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