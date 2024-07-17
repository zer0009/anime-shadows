import React from 'react';
import { CircularProgress, Typography, Container } from '@mui/material';
import useFetchUserData from '../hooks/useFetchUserData';
import HistoryList from '../components/HistoryList/HistoryList';
import styles from './History.module.css';

const History = () => {
    const { userData, animeDetails, loading, error } = useFetchUserData();

    if (loading) {
        return <div className={styles.loading}><CircularProgress /></div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const filteredHistory = userData.history.filter(item => animeDetails[item.anime] && !animeDetails[item.anime].error);

    return (
        <Container className={styles.historyPage}>
            <Typography variant="h4" className={styles.pageTitle}>Watch History</Typography>
            {filteredHistory.length > 0 ? (
                <HistoryList watchedEpisodes={filteredHistory} animeDetails={animeDetails} />
            ) : (
                <Typography variant="body1" className={styles.noHistoryMessage}>
                    No watched episodes found.
                </Typography>
            )}
        </Container>
    );
};

export default History;