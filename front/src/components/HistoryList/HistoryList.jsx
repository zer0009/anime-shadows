import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './HistoryList.module.css';

const HistoryList = ({ watchedEpisodes, animeDetails }) => {
    return (
        <Container className={styles.historyList}>
            <Row>
                {watchedEpisodes.map(item => (
                    <Col key={item.anime} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <AnimeCard
                            anime={animeDetails[item.anime]}
                            lastViewed={new Date(item.views[item.views.length - 1]).toLocaleString()}
                            showLastViewed={true}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HistoryList;