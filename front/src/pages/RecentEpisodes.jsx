import React, { useState, useEffect } from 'react';
import { fetchRecentEpisodes } from '../api/modules/episode';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography } from '@mui/material';

const RecentEpisodes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [episodeList, setEpisodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchRecentEpisodes(currentPage);
        setEpisodeList(response.episodes);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError('Error fetching recent episodes');
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
        Recently Updated Episodes
      </Typography>
      <ListDisplay
        title="Recently Updated Episodes"
        list={episodeList}
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

export default RecentEpisodes;