import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchMovieList from '../hooks/useFetchMovieList';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Container, Typography, Grid } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from 'react-i18next';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './MovieList.module.css';

const MovieList = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const { movieList, loading, error, totalPages } = useFetchMovieList(currentPage, 36); // Fetch 36 movies per page

    const handlePageChange = useCallback((page) => {
        setSearchParams({ page: page.toString() });
        window.scrollTo(0, 0);
    }, [setSearchParams]);

    useEffect(() => {
        if (currentPage === undefined) {
            setSearchParams({ page: '1' });
        }
    }, [currentPage, setSearchParams]);

    const currentYear = new Date().getFullYear();

    const seoProps = useMemo(() => ({
        title: t('movieList.title', { year: currentYear }),
        description: t('movieList.description', { year: currentYear }),
        keywords: t('movieList.keywords', { year: currentYear }),
        canonicalUrl: `https://animeshadows.xyz/movie-list?page=${currentPage}`,
        ogType: 'website',
        ogImage: 'https://animeshadows.xyz/anime-movies-og-image.jpg',
        twitterImage: 'https://animeshadows.xyz/anime-movies-twitter-image.jpg',
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": t('movieList.title', { year: currentYear }),
                "description": t('movieList.description', { year: currentYear }),
                "url": `https://animeshadows.xyz/movie-list?page=${currentPage}`,
                "inLanguage": "ar",
                "isPartOf": {
                    "@type": "WebSite",
                    "name": "Anime Shadows",
                    "alternateName": "أنمي شادوز",
                    "url": "https://animeshadows.xyz"
                },
                "about": {
                    "@type": "Thing",
                    "name": `Anime Movies ${currentYear}`
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": movieList.map((movie, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://animeshadows.xyz/anime/${movie.slug}`,
                    "name": movie.title,
                    "image": movie.coverImage,
                    "description": movie.description
                }))
            }
        ]
    }), [t, currentPage, movieList, currentYear]);

    useSEO(seoProps);

    return (
        <HelmetProvider>
            <Box className={styles.movieListPage}>
                <Container maxWidth="xl">
                    <BreadcrumbsComponent
                        links={[]}
                        current={t('movieList.breadcrumb')}
                    />
                    <Typography variant="h1" className={styles.pageTitle}>
                        {t('movieList.listTitle')}
                    </Typography>

                    {loading ? (
                        <Typography className={styles.loadingMessage}>{t('common.loading')}</Typography>
                    ) : error ? (
                        <Typography color="error" className={styles.errorMessage}>{t('common.error')}</Typography>
                    ) : movieList.length === 0 ? (
                        <Typography className={styles.noMoviesMessage}>{t('movieList.noMovies')}</Typography>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                {movieList.map((movie) => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={movie._id}>
                                        <AnimeCard anime={movie} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Box className={styles.paginationContainer}>
                                <PaginationComponent
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </Box>
                        </>
                    )}
                </Container>
            </Box>
        </HelmetProvider>
    );
};

export default MovieList;