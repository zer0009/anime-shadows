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
            <div className={styles.grid}>
                {list.length > 0 ? (
                    list.map(item => (
                        <AnimeCard 
                            key={item._id}
                            anime={item} 
                            episodeNumber={item.episodeNumber} 
                            onClick={() => fields.onClick(item._id)} 
                        />
                    ))
                ) : (
                    <Typography variant="body1" className={styles.noItemsMessage}>
                        No items found.
                    </Typography>
                )}
            </div>
        </div>
    );
});

export default ListDisplay;