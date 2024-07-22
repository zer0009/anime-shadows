import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import Footer from '../components/common/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
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
                setPopularAnimes(response.sortedAnimes || []); // Ensure popularAnimes is always an array
            } catch (error) {
                console.error('Error fetching popular animes:', error);
                setPopularAnimes([]); // Set to empty array on error
            }
        };

        fetchPopular();
    }, []);

    const handleAnimeClick = async (animeId) => {
        if (!animeId) {
            return;
        }

        try {
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
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popular Anime</h2>
                    <button className={styles.moreButton} onClick={() => navigate('/popular-anime')}>More</button>
                </div>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {popularAnimes.map((anime) => (
                        <SwiperSlide key={anime._id}>
                            <AnimeCard
                                anime={anime}
                                onClick={() => {
                                    handleAnimeClick(anime._id);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Anime List</h2>
                    <button className={styles.moreButton} onClick={() => navigate('/anime-list')}>More</button>
                </div>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {(searchResults.length > 0 ? searchResults : animeList).map((anime) => (
                        <SwiperSlide key={anime._id}>
                            <AnimeCard
                                anime={anime}
                                onClick={() => {
                                    handleAnimeClick(anime._id);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recently Updated Episodes</h2>
                    <button className={styles.moreButton} onClick={() => navigate('/recent-episodes')}>More</button>
                </div>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
                        <SwiperSlide key={episode._id}>
                            <AnimeCard
                                anime={episode.anime}
                                episodeNumber={episode.number}
                                onClick={() => {
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