import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';
import { Box, Container, Fab, Grid, Skeleton, Button, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

const HeroSection = lazy(() => import('../components/HeroSection/HeroSection'));
const AnimeSection = lazy(() => import('../components/AnimeSection/AnimeSection'));
const AnimeCard = lazy(() => import('../components/AnimeCard/AnimeCard'));
const LoadingSpinner = lazy(() => import('../components/common/LoadingSpinner'));

import hero1Webp from '/assets/images/hero1_optimized.webp';
import hero2Webp from '/assets/images/hero2_optimized.webp';
import hero3Webp from '/assets/images/hero3_optimized.webp';
import hero1Jpg from '/assets/images/hero1_optimized.jpg';
import hero2Jpg from '/assets/images/hero2_optimized.jpg';
import hero3Jpg from '/assets/images/hero3_optimized.jpg';

const Home = () => {
    const { t } = useTranslation();
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const { recentEpisodes, loading: recentLoading, error: recentError } = useFetchRecentEpisodes();
    const [popularAnimes, setPopularAnimes] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    const handleAnimeClick = useCallback(async (animeId) => {
        if (!animeId) return;
        try {
            await fetchAnimeById(animeId);
            navigate(`/anime/${animeId}`);
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    }, [navigate]);

    const heroImages = useMemo(() => [
        { webp: hero1Webp, jpg: hero1Jpg, alt: t('home.featuredAnime1') },
        { webp: hero2Webp, jpg: hero2Jpg, alt: t('home.featuredAnime2') },
        { webp: hero3Webp, jpg: hero3Jpg, alt: t('home.featuredAnime3') },
    ], [t]);

    const seoProps = useMemo(() => ({
        title: t('home.title', 'أنمي شادوز - موقعك الأول لمشاهدة الأنمي | Anime Shadows'),
        description: t('home.description', 'استمتع بمشاهدة أحدث وأفضل الأنميات المترجمة بجودة عالية على أنمي شادوز. اكتشف مجموعة واسعة من الأنمي، من الكلاسيكيات إلى الإصدارات الجديدة.'),
        keywords: t('home.keywords', 'أنمي مترجم, مشاهدة أنمي, تحميل أنمي, أنمي جديد 2024, أفضل أنمي, أنمي أون لاين, حلقات أنمي, أفلام أنمي, أنمي بدون إعلانات, أنمي بالعربي, أنمي مصر, أنمي رومانسي, أنمي أكشن, أنمي كوميدي, أنمي دراما, أنمي مغامرات, أنمي خيال علمي, أنمي فانتازيا, anime shadows, anime slayer, anime witcher, anime online, anime episodes, anime movies, anime without ads, anime in arabic, anime in egypt, romance anime, action anime, comedy anime, drama anime, adventure anime, sci-fi anime, fantasy anime, +17 اتشى'),
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
    }), [t, popularAnimes, recentEpisodes]);

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
                <meta name="robots" content="index, follow" />
            </Helmet>
            {seo.jsonLd && seo.jsonLd.map((item, index) => (
                <JsonLd key={index} item={item} />
            ))}
            <Suspense fallback={<LoadingSpinner />}>
                <HeroSection heroImages={heroImages} t={t} />
                <Container maxWidth="lg" className={styles.mainContent}>
                    <AnimeSection
                        title="popularAnime"
                        items={popularAnimes}
                        loading={loading}
                        navigate={navigate}
                        handleAnimeClick={handleAnimeClick}
                        t={t}
                        isMobile={isMobile}
                    />
                    <section aria-labelledby="recent-episodes-heading" className={styles.recentEpisodesSection}>
                        <div className={styles.sectionHeader}>
                            <h2 id="recent-episodes-heading" className={styles.sectionTitle}>{t('home.recentEpisodes')}</h2>
                            <Button 
                                variant="contained"
                                onClick={() => navigate('/recent-episodes')} 
                                aria-label={t('home.moreRecentEpisodes')}
                                className={styles.moreButton}
                            >
                                {t('home.more')}
                            </Button>
                        </div>
                        {recentLoading ? (
                            <Grid container spacing={1}>
                                {[...Array(10)].map((_, index) => (
                                    <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                                        <Skeleton variant="rectangular" width="100%" height={200} />
                                        <Skeleton width="60%" />
                                        <Skeleton width="40%" />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            isMobile ? (
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    breakpoints={{
                                        320: { slidesPerView: 1 },
                                        425: { slidesPerView: 2 },
                                        640: { slidesPerView: 3 },
                                    }}
                                    autoplay={{ delay: 3000 }}
                                    pagination={{ clickable: true }}
                                    scrollbar={{ draggable: true }}
                                >
                                    {recentEpisodes.map((episode) => (
                                        <SwiperSlide key={episode._id}>
                                            <AnimeCard
                                                anime={episode.anime}
                                                episodeTitle={episode.title}
                                                episodeId={episode._id}
                                                onClick={() => handleAnimeClick(episode.anime._id)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <Grid container spacing={1}>
                                    {recentEpisodes.map((episode) => (
                                        <Grid item xs={12} sm={6} md={3} lg={2.4} key={episode._id}>
                                            <AnimeCard
                                                anime={episode.anime}
                                                episodeNumber={episode.number}
                                                episodeId={episode._id}
                                                onClick={() => handleAnimeClick(episode.anime._id)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )
                        )}
                    </section>
                    <AnimeSection
                        title="animeList"
                        items={searchResults.length > 0 ? searchResults : animeList}
                        loading={loading}
                        navigate={navigate}
                        handleAnimeClick={handleAnimeClick}
                        t={t}
                        isMobile={isMobile}
                    />
                </Container>
            </Suspense>
            {showScrollTop && (
                <Fab color="primary" size="small" aria-label="scroll back to top" className={styles.scrollTopButton} onClick={scrollToTop}>
                    <KeyboardArrowUpIcon />
                </Fab>
            )}
        </>
    );
};

export default React.memo(Home);