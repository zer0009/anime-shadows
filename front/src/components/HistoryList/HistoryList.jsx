import React from 'react';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './HistoryList.module.css';

const HistoryList = ({ watchedEpisodes, animeDetails }) => {

    return (
        <div className={styles.grid}>
            {watchedEpisodes.map(item => (
                <AnimeCard
                    anime={animeDetails[item.anime]}
                    lastViewed={new Date(item.views[item.views.length - 1]).toLocaleString()}
                    showLastViewed={true}
                />
            ))}
        </div>
    );
};

export default HistoryList;