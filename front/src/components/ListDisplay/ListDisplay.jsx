import React from 'react';
import { CircularProgress, Typography, Grid, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import AnimeCard from '../AnimeCard/AnimeCard';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import styles from './ListDisplay.module.css';

const ListDisplay = React.memo(({ title, list, loading, error, fields }) => {
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.only('xs'));
    const isSmScreen = useMediaQuery(theme.breakpoints.only('sm'));

    const getGridColumns = () => {
        if (isXsScreen) return 2;
        if (isSmScreen) return 3;
        return 6;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: 'var(--highlight-color)' }} />
                    </Box>
                    <Grid container spacing={2}>
                        {[...Array(getGridColumns() * 2)].map((_, index) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height={0}
                                    sx={{ paddingTop: '150%', bgcolor: 'var(--secondary-dark)' }}
                                />
                                <Skeleton width="60%" sx={{ mt: 1, bgcolor: 'var(--secondary-dark)' }} />
                                <Skeleton width="40%" sx={{ bgcolor: 'var(--secondary-dark)' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            );
        }

        if (error) {
            return (
                <Box className={styles.messageBox}>
                    <ErrorOutlineIcon sx={{ fontSize: 60, color: 'var(--error-color)' }} />
                    <Typography variant="h6" color="error" className={styles.errorMessage}>
                        {error}
                    </Typography>
                </Box>
            );
        }

        if (list.length === 0) {
            return (
                <Box className={styles.messageBox}>
                    <SearchOffIcon sx={{ fontSize: 60, color: 'var(--subtext-color)' }} />
                    <Typography variant="h6" className={styles.noItemsMessage}>
                        No items found.
                    </Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={2}>
                {list.map(item => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={item._id}>
                        <AnimeCard 
                            anime={item} 
                            episodeNumber={item.episodeNumber} 
                            onClick={() => fields.onClick(item._id)} 
                        />
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Box className={styles.listPage}>
            <Typography variant="h4" component="h2" className={styles.pageTitle} gutterBottom>
                {title}
            </Typography>
            {renderContent()}
        </Box>
    );
});

export default ListDisplay;