import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{
                color: 'var(--highlight-color)',
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: 'var(--highlight-color)',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
        </Box>
    );
};

export default LoadingSpinner;