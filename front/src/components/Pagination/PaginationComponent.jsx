import React from 'react';
import { Pagination, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box
      dir={isRTL ? 'ltr' : 'ltr'} // Set direction based on text direction
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        width: '100%',
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'var(--text-color)',
            backgroundColor: 'var(--primary-dark)',
            '&:hover': {
              backgroundColor: 'var(--highlight-color)',
            },
          },
          '& .Mui-selected': {
            backgroundColor: 'var(--highlight-color) !important',
            color: 'white',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
          sx={{
            backgroundColor: 'var(--secondary-dark)',
            color: 'var(--text-color)',
            '&:hover': {
              backgroundColor: 'var(--highlight-color)',
            },
          }}
        >
          {isRTL ? 'التالي' : 'Previous'}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
          sx={{
            backgroundColor: 'var(--secondary-dark)',
            color: 'var(--text-color)',
            '&:hover': {
              backgroundColor: 'var(--highlight-color)',
            },
          }}
        >
          {isRTL ? 'السابق' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default PaginationComponent;