import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import SearchBar from '../components/SearchBar/SearchBar';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar,Autoplay } from 'swiper/modules';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import Helmet for SEO
import styles from './Home.module.css';

const Home = () => {
    const { t, i18n } = useTranslation();
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
        <HelmetProvider>
            <Helmet>
                <title>{t('home.title')} - {t('home.subtitle')}</title>
                <meta name="description" content={t('home.description')} />
                <meta name="keywords" content={t('home.keywords')} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "WebPage",
                        "name": t('home.title'),
                        "description": t('home.description'),
                        "url": window.location.href,
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": popularAnimes.map((anime, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "url": `${window.location.origin}/anime/${anime._id}`,
                                "name": anime.title
                            }))
                        }
                    })}
                </script>
            </Helmet>
            <div className={styles.home}>
            <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]} // Include Autoplay module
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }} // Add autoplay settings
                    className={styles.heroSwiper}
                >
                    <SwiperSlide>
                        <img src="/assets/images/hero1.jpg" alt="Hero 1" className={styles.heroImage} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/assets/images/hero2.jpg" alt="Hero 2" className={styles.heroImage} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/assets/images/hero3.jpg" alt="Hero 3" className={styles.heroImage} />
                    </SwiperSlide>
                </Swiper>

                <div className={styles.content}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('home.popularAnime')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/popular-anime')}>{t('home.more')}</button>
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
                        <h2 className={styles.sectionTitle}>{t('home.animeList')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/anime-list')}>{t('home.more')}</button>
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
                        <h2 className={styles.sectionTitle}>{t('home.recentEpisodes')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/recent-episodes')}>{t('home.more')}</button>
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
                                    episodeTitle={episode.title}
                                    onClick={() => {
                                        handleAnimeClick(episode.anime._id);
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </HelmetProvider>
    );
};

export default Home;