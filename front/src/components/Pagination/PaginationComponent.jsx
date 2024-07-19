import React from 'react';
import { Pagination, Button, Box } from '@mui/material';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
        shape="rounded"
        showFirstButton
        showLastButton
      />
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
        >
          Previous
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PaginationComponent;