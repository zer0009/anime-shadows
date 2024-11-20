import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPopularAnime } from '../api/modules/anime';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';
import {Container, Fab,Skeleton, Button, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import AdComponent from '../components/AdComponent/AdComponent'; // Import AdComponent

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
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { user } = useAuth(); // Get user from useAuth
    const isAdminOrModerator = user && (user.role === 'admin' || user.role === 'moderator'); // Define isAdminOrModerator

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
                const response = await fetchPopularAnime('today');
                setPopularAnimes(response.sortedAnimes || []);
            } catch (error) {
                setPopularAnimes([]);
            }
        };

        fetchPopular();
    }, []);

    const handleAnimeClick = useCallback((slug) => {
        if (!slug) return;
        navigate(`/anime/${slug}`);
    }, [navigate]);

    const heroImages = useMemo(() => [
        { webp: hero1Webp, jpg: hero1Jpg, alt: t('home.featuredAnime1') },
        { webp: hero2Webp, jpg: hero2Jpg, alt: t('home.featuredAnime2') },
        { webp: hero3Webp, jpg: hero3Jpg, alt: t('home.featuredAnime3') },
    ], [t]);

    const seoProps = useMemo(() => ({
        title: t('home.title', 'Anime Shadows - أفضل موقع لمشاهدة وتحميل الأنمي المترجم'),
        description: t('home.description', 'استمتع بمشاهدة أحدث وأفضل الأنميات المترجمة بجودة عالية وسيرفرات متعددة على أنمي شادوز. اكتشف مجموعة واسعة من الأنمي، من الكلاسيكيات إلى الإصدارات الجديدة. مشاهدة مباشرة بدون إعلانات مزعجة.'),
        keywords: t('home.keywords', 'أنمي شادوز, Anime Shadows, أنمي مترجم, مشاهدة أنمي, أنمي اون لاين, أحدث الأنميات, أفضل الأنميات, anime ar, anime arabic, anime مترجم, تحميل أنمي, arabic anime, أنمي عربي, anime online, anime streaming, مسلسلات أنمي, مواقع أنمي, مواقع الانمي, انمى بجودة عالية, أفلام أنمي, مانجا, حلقات أنمي جديدة, أنمي بدون إعلانات, أنمي مدبلج, قائمة الأنمي, مواعيد عرض الأنمي, تصنيفات الأنمي, أنمي رومانسي, أنمي أكشن, أنمي خيال علمي, أنمي كوميدي, أنمي دراما'),
        canonicalUrl: 'https://animeshadows.xyz',
        ogType: 'website',
        ogImage: 'https://animeshadows.xyz/default-og-image.jpg',
        twitterImage: 'https://animeshadows.xyz/default-twitter-image.jpg',
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
                "name": t('home.popularAnime', 'الأنميات الشائعة'),
                "itemListElement": popularAnimes.map((anime, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://animeshadows.xyz/anime/${anime.slug}`,
                    "name": anime.title
                }))
            },
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": t('home.title', 'Anime Shadows - موقعك الأول لمشاهدة الأنمي'),
                "description": t('home.description', 'استمتع بمشاهدة أحدث وأفضل الأنميات المترجمة بجودة عالية وسيرفرات متعددة على أنمي شادوز. اكتشف مجموعة واسعة من الأنمي، من الكلاسيكيات إلى الإصدارات الجديدة.'),
                "url": "https://animeshadows.xyz",
                "hasPart": [
                    {
                        "@type": "ItemList",
                        "name": t('home.popularAnime', 'الأنميات الشائعة'),
                        "itemListElement": popularAnimes.map((anime, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://animeshadows.xyz/anime/${anime.slug}`,
                            "name": anime.title
                        }))
                    },
                    {
                        "@type": "ItemList",
                        "name": t('home.recentEpisodes', 'الحلقات الجديدة'),
                        "itemListElement": recentEpisodes.map((episode, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://animeshadows.xyz/episode/${episode.anime.slug}-الحلقة-${episode.number}`,
                            "name": `${episode.anime.title} - ${episode.title}`
                        }))
                    }
                ]
            },
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Anime Shadows",
                "url": "https://animeshadows.xyz",
                "logo": "https://animeshadows.xyz/logo.png",
                "sameAs": [
                    "https://www.facebook.com/animeshadows",
                    "https://twitter.com/animeshadows",
                    "https://www.instagram.com/animeshadows"
                ]
            }
        ]
    }), [t, popularAnimes, recentEpisodes]);

    useSEO(seoProps);

    const renderRecentEpisodes = () => {
        if (recentLoading) {
            return (
                <div className={styles.recentAnimeGrid}>
                    {[...Array(24)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" className={styles.recentAnimeCard} />
                    ))}
                </div>
            );
        }

        const displayCount = isMobile ? 12 : isTablet ? 18 : 24;
        const displayEpisodes = recentEpisodes.slice(0, displayCount);

        if (isMobile || isTablet) {
            return (
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={isMobile ? 2 : 3}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        480: { slidesPerView: 3 },
                        640: { slidesPerView: 4 },
                    }}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    className={styles.recentEpisodesSwiper}
                >
                    {displayEpisodes.map((episode) => (
                        <SwiperSlide key={episode._id}>
                            <AnimeCard
                                anime={episode.anime}
                                episodeTitle={episode.title}
                                episodeNumber={episode.number}
                                episodeId={episode._id}
                                availableSubtitles={episode.availableSubtitles} // Ensure correctness
                                onClick={() => handleAnimeClick(episode.anime.slug, episode.number)}
                                className={styles.recentAnimeCard}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            );
        }

        return (
            <div className={styles.recentAnimeGrid}>
                {displayEpisodes.map((episode) => (
                    <AnimeCard
                        key={episode._id}
                        anime={episode.anime}
                        episodeNumber={episode.number}
                        episodeId={episode._id}
                        availableSubtitles={episode.availableSubtitles} // Ensure correctness
                        onClick={() => handleAnimeClick(episode.anime.slug, episode.number)}
                        className={styles.recentAnimeCard}
                    />
                ))}
            </div>
        );
    };

    return (
        <HelmetProvider>
            <Helmet>
                {/* Preload without crossorigin */}
                <link
                    rel="preload"
                    as="image"
                    href="/assets/images/hero1_optimized.webp"
                    type="image/webp"
                />
                <link
                    rel="preload"
                    as="image"
                    href="/assets/images/hero1_optimized.jpg"
                    type="image/jpeg"
                />
            </Helmet>
            <Suspense fallback={<LoadingSpinner />}>
                <HeroSection heroImages={heroImages} t={t} />

                {/* Top Banner Ad */}
                <AdComponent 
                    adKey="ea9ea029a7a095b803da9b265289a2fe"
                    format="iframe"
                    height={90}
                    width={728}
                    showAd={!isAdminOrModerator}
                />
                
                <Container maxWidth={false} className={styles.mainContent}>
                    <AnimeSection
                        title="popularAnime"
                        items={popularAnimes}
                        loading={loading}
                        navigate={navigate}
                        t={t}
                        isMobile={isMobile}
                        moreLink="/popular-anime/"
                    />
                    
                    {/* Medium Rectangle Ad */}
                    <AdComponent 
                        adKey="d3b3d418ac4671f3a58fb377907a15ef"
                        format="iframe"
                        height={250}
                        width={300}
                        showAd={!isAdminOrModerator}
                    />
                    
                    <section aria-labelledby="recent-episodes-heading" className={styles.recentEpisodesSection}>
                        <div className={styles.sectionHeader}>
                            <h3 id="recent-episodes-heading" className={styles.sectionTitle}>
                                {t('home.recentEpisodes')}
                            </h3>
                            <Button 
                                variant="contained"
                                onClick={() => navigate('/recent-episodes')} 
                                aria-label={t('home.moreRecentEpisodes')}
                                className={styles.moreButton}
                            >
                                {t('home.more')}
                            </Button>
                        </div>
                        {renderRecentEpisodes()}
                    </section>
                    
                    {/* Small Banner Ad */}
                    <AdComponent 
                        adKey="28630403fc8223d48e43d715d6859324"
                        format="iframe"
                        height={60}
                        width={468}
                        showAd={!isAdminOrModerator}
                    />
                    
                    <AnimeSection
                        title="animeList"
                        items={searchResults.length > 0 ? searchResults : animeList}
                        loading={loading}
                        navigate={navigate}
                        t={t}
                        isMobile={isMobile}
                        moreLink="/anime-list/"
                    />
                </Container>
                
                {/* Bottom Banner Ad */}
                <AdComponent 
                    adKey="ea9ea029a7a095b803da9b265289a2fe"
                    format="iframe"
                    height={90}
                    width={728}
                    showAd={!isAdminOrModerator}
                />

                {/* Popunder Ad */}
                <AdComponent 
                    adKey="popunder"
                    showAd={!isAdminOrModerator}
                />
            </Suspense>
            {showScrollTop && (
                <Fab 
                    color="primary" 
                    size="small" 
                    aria-label="scroll back to top" 
                    className={styles.scrollTopButton} 
                    onClick={scrollToTop}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            )}
        </HelmetProvider>
    );
};

export default React.memo(Home);