import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchMovieList from '../hooks/useFetchMovieList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Container } from '@mui/material';
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
    const { movieList, loading, error, totalPages } = useFetchMovieList(currentPage);

    const handlePageChange = useCallback((page) => {
        setSearchParams({ page });
    }, [setSearchParams]);

    useEffect(() => {
        if (currentPage === undefined) {
            setSearchParams({ page: 1 });
        }
    }, [currentPage, setSearchParams]);

    const currentYear = new Date().getFullYear();

    const seoProps = useMemo(() => ({
        title: t('movieList.title', `قائمة أفلام الأنمي ${currentYear} | أنمي شادوز - Anime Shadows`),
        description: t('movieList.description', `أحدث أفلام الأنمي لعام ${currentYear} على أنمي شادوز. شاهد أفلامك المفضلة مترجمة بجودة عالية. اكتشف أفضل الأفلام الآن!`),
        keywords: t('movieList.keywords', `أفلام أنمي ${currentYear}, أنمي شادوز, أفلام مترجمة, أفلام HD, أنمي جديد, رومانسي, أكشن, مغامرات, خيال علمي, كوميدي`),
        canonicalUrl: `https://animeshadows.xyz/movie-list?page=${currentPage}`,
        ogType: 'website',
        ogImage: 'https://animeshadows.xyz/anime-movies-og-image.jpg',
        twitterImage: 'https://animeshadows.xyz/anime-movies-twitter-image.jpg',
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": t('movieList.title', `قائمة أفلام الأنمي ${currentYear} | أنمي شادوز - Anime Shadows`),
                "description": t('movieList.description', `أحدث أفلام الأنمي لعام ${currentYear} على أنمي شادوز. شاهد أفلامك المفضلة مترجمة بجودة عالية. اكتشف أفضل الأفلام الآن!`),
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
            <Container maxWidth="lg" className={styles.movieListPage}>
                <BreadcrumbsComponent
                    links={[]}
                    current={t('movieList.breadcrumb', 'قائمة الأفلام')}
                />
                <Box sx={{ padding: '20px' }}>
                    <ListDisplay
                        title={t('movieList.listTitle', 'قائمة الأفلام')}
                        list={movieList}
                        loading={loading}
                        error={error}
                        fields={['title', 'genre', 'rating']}
                    />
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </Container>
        </HelmetProvider>
    );
};

export default MovieList;