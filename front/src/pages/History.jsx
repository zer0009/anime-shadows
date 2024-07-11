import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import useFetchUserData from '../hooks/useFetchUserData';
import HistoryList from '../components/HistoryList/HistoryList';
import styles from './History.module.css';

const History = () => {
    const { userData, animeDetails } = useFetchUserData();

    if (!userData) {
        return <CircularProgress />;
    }

    return (
        <div className={styles.historyPage}>
            {userData.history && userData.history.length > 0 ? (
                <HistoryList watchedEpisodes={userData.history} animeDetails={animeDetails} />
            ) : (
                <Typography variant="body1" className={styles.noHistoryMessage}>
                    No watched episodes found.
                </Typography>
            )}
        </div>
    );
};

export default History;