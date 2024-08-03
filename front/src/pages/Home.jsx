import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, fetchPopularAnime } from '../api/modules/anime';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';
import { Box, Container, Fab, Grid, Skeleton, Button } from '@mui/material';
import AnimeCard from '../components/AnimeCard/AnimeCard';
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

import HeroSection from '../components/HeroSection/HeroSection';
import AnimeSection from '../components/AnimeSection/AnimeSection';


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
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
            {seo.jsonLd && seo.jsonLd.map((item, index) => (
                <JsonLd key={index} item={item} />
            ))}
            <HeroSection heroImages={heroImages} t={t} />
            <Container maxWidth="lg" className={styles.mainContent}>
                <AnimeSection
                    title="popularAnime"
                    items={popularAnimes}
                    loading={loading}
                    navigate={navigate}
                    handleAnimeClick={handleAnimeClick}
                    t={t}
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
                                <Grid item xs={12} sm={6} md={4} lg={2.4} key={episode._id}>
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
                <AnimeSection
                    title="animeList"
                    items={searchResults.length > 0 ? searchResults : animeList}
                    loading={loading}
                    navigate={navigate}
                    handleAnimeClick={handleAnimeClick}
                    t={t}
                />
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