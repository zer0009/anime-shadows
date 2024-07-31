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
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';
import { Box, Typography, Container } from '@mui/material';

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
                setPopularAnimes(response.sortedAnimes || []);
            } catch (error) {
                console.error('Error fetching popular animes:', error);
                setPopularAnimes([]);
            }
        };

        fetchPopular();
    }, []);

    const handleAnimeClick = async (animeId) => {
        if (!animeId) return;
        try {
            await fetchAnimeById(animeId);
            navigate(`/anime/${animeId}`);
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    const seoProps = {
        title: t('home.title'),
        description: t('home.description'),
        keywords: t('home.keywords'),
        canonicalUrl: 'https://animeshadows.xyz',
        ogType: 'website',
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Anime Shadows",
                "alternateName": "أنمي شادوز",
                "url": "https://animeshadows.xyz",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://animeshadows.xyz/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": popularAnimes.map((anime, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://animeshadows.xyz/anime/${anime._id}`,
                    "name": anime.title
                }))
            },
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": t('home.title'),
                "description": t('home.description'),
                "url": "https://animeshadows.xyz",
                "hasPart": [
                    {
                        "@type": "ItemList",
                        "name": t('home.popularAnime'),
                        "itemListElement": popularAnimes.map((anime, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://animeshadows.xyz/anime/${anime._id}`,
                            "name": anime.title
                        }))
                    },
                    {
                        "@type": "ItemList",
                        "name": t('home.recentEpisodes'),
                        "itemListElement": recentEpisodes.map((episode, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://animeshadows.xyz/episode/${episode._id}`,
                            "name": `${episode.anime.title} - ${episode.title}`
                        }))
                    }
                ]
            }
        ]
    };

    const seo = useSEO(seoProps);

    return (
        <>
            <Helmet>
                {seo.helmet.title && <title>{seo.helmet.title}</title>}
                {seo.helmet.meta.map((meta, index) => (
                    <meta key={index} {...meta} />
                ))}
                {seo.helmet.link.map((link, index) => (
                    <link key={index} {...link} />
                ))}
            </Helmet>
            {seo.jsonLd && seo.jsonLd.map((item, index) => (
                <JsonLd key={index} item={item} />
            ))}
            
            <Box className={styles.heroSection}>
                <Container maxWidth="lg">
                    <Box className={styles.heroContent}>
                        <Typography variant="h1" className={styles.mainHeading}>
                            {t('home.mainHeading', 'أنمي شادوز')}
                        </Typography>
                        <Typography variant="h2" className={styles.subHeading}>
                            {t('home.subHeading', 'موقعك الأول لمشاهدة الأنمي')}
                        </Typography>
                        <Typography variant="body1" className={styles.introText}>
                            {t('home.introText', 'مرحبًا بك في أنمي شادوز، وجهتك الأولى لمشاهدة أحدث وأفضل الأنميات. استمتع بمجموعة واسعة من الأنميات المترجمة بجودة عالية.')}
                        </Typography>
                    </Box>
                </Container>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className={styles.heroSwiper}
                >
                    <SwiperSlide>
                        <img src="/assets/images/hero1.jpg" alt={t('home.featuredAnime1')} className={styles.heroImage} loading="lazy" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/assets/images/hero2.jpg" alt={t('home.featuredAnime2')} className={styles.heroImage} loading="lazy" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/assets/images/hero3.jpg" alt={t('home.featuredAnime3')} className={styles.heroImage} loading="lazy" />
                    </SwiperSlide>
                </Swiper>
            </Box>

            <div className={styles.content}>
                {/* Popular Anime Section */}
                <section aria-labelledby="popular-anime-heading">
                    <div className={styles.sectionHeader}>
                        <h2 id="popular-anime-heading" className={styles.sectionTitle}>{t('home.popularAnime')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/popular-anime')} aria-label={t('home.morePopularAnime', 'عرض المزيد من الأنميات الشائعة')}>{t('home.more')}</button>
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
                                    onClick={() => handleAnimeClick(anime._id)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                {/* Anime List Section */}
                <section aria-labelledby="anime-list-heading">
                    <div className={styles.sectionHeader}>
                        <h2 id="anime-list-heading" className={styles.sectionTitle}>{t('home.animeList')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/anime-list')} aria-label={t('home.moreAnimeList', 'عرض القائمة الكاملة للأنميات')}>{t('home.more')}</button>
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
                                    onClick={() => handleAnimeClick(anime._id)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                {/* Recent Episodes Section */}
                <section aria-labelledby="recent-episodes-heading">
                    <div className={styles.sectionHeader}>
                        <h2 id="recent-episodes-heading" className={styles.sectionTitle}>{t('home.recentEpisodes')}</h2>
                        <button className={styles.moreButton} onClick={() => navigate('/recent-episodes')} aria-label={t('home.moreRecentEpisodes', 'عرض المزيد من الحلقات الحديثة')}>{t('home.more')}</button>
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
                                    onClick={() => handleAnimeClick(episode.anime._id)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            </div>
        </>
    );
};

export default Home;