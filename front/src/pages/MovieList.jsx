import React, { useState, useEffect } from 'react';
import useFetchMovieList from '../hooks/useFetchMovieList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';

const MovieList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { movieList, loading, error, totalPages } = useFetchMovieList(currentPage);

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