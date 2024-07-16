import React from 'react';
import { CircularProgress, Typography, Container } from '@mui/material';
import useFetchUserData from '../hooks/useFetchUserData';
import HistoryList from '../components/HistoryList/HistoryList';
import styles from './History.module.css';

const History = () => {
    const { userData, animeDetails } = useFetchUserData();

    if (!userData) {
        return <div className={styles.loading}><CircularProgress /></div>;
    }

    return (
        <Container className={styles.historyPage}>
            <Typography variant="h4" className={styles.pageTitle}>Watch History</Typography>
            {userData.history && userData.history.length > 0 ? (
                <HistoryList watchedEpisodes={userData.history} animeDetails={animeDetails} />
            ) : (
                <Typography variant="body1" className={styles.noHistoryMessage}>
                    No watched episodes found.
                </Typography>
            )}
        </Container>
    );
};

export default History;