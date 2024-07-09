import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimeById } from '../api/modules/anime';
import { saveAnimeToHistory } from '../api/modules/user';
import AnimeCard from '../components/AnimeCard/AnimeCard.jsx';
import Footer from '../components/common/Footer.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import { Grid } from '@mui/joy';
import { Container } from '@mui/material';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import styles from './Home.module.css';

const Home = () => {
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const navigate = useNavigate();

    const handleAnimeClick = async (animeId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await saveAnimeToHistory(animeId);
            }
            const response = await fetchAnimeById(animeId);
            navigate(`/anime/${animeId}`);
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    return (
        <div className={styles.home}>
            <div className={styles.heroSection}>
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}>Welcome to Anime World</h1>
                    <p className={styles.heroSubtitle}>Discover your favorite anime</p>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <Container>
                <h2 className={styles.homeTitle}>Anime List</h2>
                {loading && <div className={styles.loading}>Loading...</div>}
                {error && <div className={styles.error}>{error}</div>}
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {(searchResults.length > 0 ? searchResults : animeList).map(anime => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={anime._id}>
                            <AnimeCard anime={anime} onClick={() => handleAnimeClick(anime._id)} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </div>
    );
};

export default Home;