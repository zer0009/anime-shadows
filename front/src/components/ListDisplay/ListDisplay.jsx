import React from 'react';
import { CircularProgress, Typography, Grid } from '@mui/material';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './ListDisplay.module.css';

const ListDisplay = React.memo(({ title, list, loading, error, fields }) => {
    if (loading) {
        return <div className={styles.loader}><CircularProgress /></div>;
    }

    if (error) {
        return <Typography variant="h6" color="error" className={styles.errorMessage}>{error}</Typography>;
    }

    return (
        <div className={styles.listPage}>
            <Typography variant="h4" component="h2" className={styles.pageTitle}>
                {title}
            </Typography>
            <Grid container spacing={1} className={styles.grid}>
                {list.length > 0 ? (
                    list.map(item => (
                        <Grid item xs={12} sm={6} md={4} lg={2.2} key={item._id}>
                            <AnimeCard 
                                anime={item} 
                                episodeNumber={item.episodeNumber} 
                                onClick={() => fields.onClick(item._id)} 
                            />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" className={styles.noItemsMessage}>
                        No items found.
                    </Typography>
                )}
            </Grid>
        </div>
    );
});

export default ListDisplay;