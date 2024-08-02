import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';
import { Box, Typography, Container, Grid, Button, Fab, Skeleton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import hero1Webp from '/assets/images/hero1_optimized.webp';
import hero2Webp from '/assets/images/hero2_optimized.webp';
import hero3Webp from '/assets/images/hero3_optimized.webp';
import hero1Jpg from '/assets/images/hero1_optimized.jpg';
import hero2Jpg from '/assets/images/hero2_optimized.jpg';
import hero3Jpg from '/assets/images/hero3_optimized.jpg';

const heroImages = [
    { webp: hero1Webp, jpg: hero1Jpg, alt: 'Featured Anime 1' },
    { webp: hero2Webp, jpg: hero2Jpg, alt: 'Featured Anime 2' },
    { webp: hero3Webp, jpg: hero3Jpg, alt: 'Featured Anime 3' },
];

const Home = () => {
    const { t } = useTranslation();
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const { recentEpisodes, loading: recentLoading, error: recentError } = useFetchRecentEpisodes();
    const [popularAnimes, setPopularAnimes] = useState([]);
    const navigate = useNavigate();

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
        keywords: t('home.keywords', 'أنمي شادوز, مشاهدة أنمي, أنمي مترجم, أنمي اون لاين, أحدث الأنميات, أفضل الأنميات, أنمي عربي, Anime Shadows, anime online, anime streaming, مسلسلات أنمي, أفلام أنمي, مانجا, حلقات أنمي جديدة, تحميل أنمي, أنمي بدون إعلانات'),
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

    const renderSwiperSection = useMemo(() => (title, items, navigateTo, ariaLabel) => (
        <section aria-labelledby={`${title}-heading`} className={styles.swiperSection}>
            <div className={styles.sectionHeader}>
                <h2 id={`${title}-heading`} className={styles.sectionTitle}>{t(`home.${title}`)}</h2>
                <Button 
                    variant="contained"
                    onClick={() => navigate(navigateTo)} 
                    aria-label={t(ariaLabel)}
                    className={styles.moreButton}
                >
                    {t('home.more')}
                </Button>
            </div>
            {loading ? (
                <Grid container spacing={1}>
                    {[...Array(16)].map((_, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5} key={index}>
                            <Box sx={{ aspectRatio: '2/3', width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height="100%" 
                                    sx={{ flexGrow: 1, minHeight: 200 }}
                                />
                                <Skeleton width="80%" sx={{ mt: 1 }} />
                                <Skeleton width="60%" />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
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
                    {items.map((item) => (
                        <SwiperSlide key={item._id}>
                            <AnimeCard
                                anime={item}
                                onClick={() => handleAnimeClick(item._id)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    ), [t, navigate, handleAnimeClick, loading]);

    const OptimizedImage = ({ webp, jpg, alt, ...props }) => {
        return (
            <picture className={styles.lazyImageWrapper}>
                <source srcSet={webp} type="image/webp" />
                <LazyLoadImage
                    src={jpg}
                    alt={alt}
                    effect="blur"
                    threshold={300}
                    wrapperClassName={styles.lazyImageWrapper}
                    {...props}
                />
            </picture>
        );
    };

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
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className={styles.heroSwiper}
                    style={{ height: '100%', width: '100%' }}
                >
                    {heroImages.map((image, index) => (
                        <SwiperSlide key={index} className={styles.heroSlide}>
                            <OptimizedImage
                                webp={image.webp}
                                jpg={image.jpg}
                                alt={image.alt}
                                className={styles.heroImage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box className={styles.heroContent}>
                    <Container maxWidth="lg">
                        <Typography variant="h1" className={styles.mainHeading}>
                            {t('home.mainHeading', 'أنمي شادوز')}
                        </Typography>
                        <Typography variant="h2" className={styles.subHeading}>
                            {t('home.subHeading', 'موقعك الأول لمشاهدة الأنمي')}
                        </Typography>
                        <Typography variant="body1" className={styles.introText}>
                            {t('home.introText', 'مرحبًا بك في أنمي شادوز، وجهتك الأولى لمشاهدة أحدث وأفضل الأنميات. استمتع بمجموعة واسعة من الأنميات المترجمة بجودة عالية.')}
                        </Typography>
                    </Container>
                </Box>
            </Box>

            <Container maxWidth="lg" className={styles.mainContent}>
                {renderSwiperSection('popularAnime', popularAnimes, '/popular-anime', 'home.morePopularAnime')}

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
                    <Grid container spacing={2}>
                        {recentLoading ? (
                            [...Array(8)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                    <Skeleton variant="rectangular" width="100%" height={200} />
                                    <Skeleton width="60%" />
                                    <Skeleton width="40%" />
                                </Grid>
                            ))
                        ) : (
                            Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={episode._id}>
                                    <AnimeCard
                                        anime={episode.anime}
                                        episodeTitle={episode.title}
                                        onClick={() => handleAnimeClick(episode.anime._id)}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </section>

                {renderSwiperSection('animeList', searchResults.length > 0 ? searchResults : animeList, '/anime-list', 'home.moreAnimeList')}
            </Container>

            {showScrollTop && (
                <Fab color="primary" size="small" aria-label="scroll back to top" className={styles.scrollTopButton} onClick={scrollToTop}>
                    <KeyboardArrowUpIcon />
                </Fab>
            )}
        </>
    );
};

export default React.memo(Home);