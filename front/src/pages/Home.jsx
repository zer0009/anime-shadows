import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimeById } from '../api/modules/anime';
import { saveAnimeToHistory } from '../api/modules/user';
import Footer from '../components/common/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import styles from './Home.module.css';

const Home = () => {
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const { recentEpisodes, loading: recentLoading, error: recentError } = useFetchRecentEpisodes();
    const navigate = useNavigate();

    const handleAnimeClick = async (animeId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await saveAnimeToHistory(animeId);
            }
            await fetchAnimeById(animeId);
            navigate(`/anime/${animeId}`);
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    useEffect(() => {
        console.log('recentEpisodes:', recentEpisodes);
    }, [recentEpisodes]);

    return (
        <div className={styles.home}>
            <div className={styles.heroSection}>
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}>Welcome to Anime World</h1>
                    <p className={styles.heroSubtitle}>Discover your favorite anime</p>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <div className={styles.content}>
                <ListDisplay
                    title="Anime List"
                    list={searchResults.length > 0 ? searchResults : animeList}
                    loading={loading}
                    error={error}
                    fields={{ onClick: handleAnimeClick }}
                />
                <ListDisplay
                    title="Recently Updated Episodes"
                    list={recentEpisodes.map(episode => ({
                        ...episode.anime,
                        episodeNumber: episode.number
                    }))}
                    loading={recentLoading}
                    error={recentError}
                    fields={{ onClick: handleAnimeClick }}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Home;
