import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './HistoryList.module.css';

const HistoryList = ({ watchedEpisodes, animeDetails }) => {
    console.log("HistoryList component is rendered");
    console.log("watchedEpisodes", watchedEpisodes[2].views)

    return (
        <Card className={styles.historyCard}>
            <CardContent>
                <Typography variant="h5" component="h3" className={styles.cardTitle}>
                    Watched Episodes
                </Typography>
                <div className={styles.animeGrid}>
                    {watchedEpisodes.map(item => (
                        <AnimeCard
                            key={item.anime}
                            anime={animeDetails[item.anime]}
                            lastViewed={new Date(item.views[item.views.length - 1]).toLocaleString()}
                            showLastViewed={true}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default HistoryList;
