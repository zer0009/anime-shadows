import React from 'react';
import { Typography } from '@mui/material';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './HistoryList.module.css';

const HistoryList = ({ watchedEpisodes, animeDetails }) => {
    return (
        <div className={styles.historyList}>
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
        </div>
    );
};

export default HistoryList;
