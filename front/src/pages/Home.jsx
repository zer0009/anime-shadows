import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import { saveAnimeToHistory } from '../api/modules/user';
import Footer from '../components/common/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import styles from './Home.module.css';

const Home = () => {
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const { recentEpisodes, loading: recentLoading, error: recentError } = useFetchRecentEpisodes();
    const [popularAnimes, setPopularAnimes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const response = await fetchPopularAnime('all');
                setPopularAnimes(response);
            } catch (error) {
                console.error('Error fetching popular animes:', error);
            }
        };

        fetchPopular();
    }, []);

    const handleAnimeClick = async (animeId) => {
        if (!animeId) {
            console.error('Anime ID is undefined');
            return;
        }

        try {
            await saveAnimeToHistory(animeId);
            console.log('Anime saved to history');
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
                <h2 className={styles.sectionTitle}>Popular Anime</h2>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={5}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {popularAnimes.map((anime) => (
                        <SwiperSlide key={anime._id}>
                            <AnimeCard
                                anime={anime}
                                onClick={() => {
                                    console.log('Anime clicked:', anime); // Debug log
                                    handleAnimeClick(anime._id);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <h2 className={styles.sectionTitle}>Anime List</h2>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={5}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {(searchResults.length > 0 ? searchResults : animeList).map((anime) => (
                        <SwiperSlide key={anime._id}>
                            <AnimeCard
                                anime={anime}
                                onClick={() => {
                                    console.log('Anime clicked:', anime); // Debug log
                                    handleAnimeClick(anime._id);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <h2 className={styles.sectionTitle}>Recently Updated Episodes</h2>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={5}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {recentEpisodes.map((episode) => (
                        <SwiperSlide key={episode._id}>
                            <AnimeCard
                                anime={episode.anime}
                                episodeNumber={episode.number}
                                onClick={() => {
                                    console.log('Episode clicked:', episode); // Debug log
                                    handleAnimeClick(episode.anime._id);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
