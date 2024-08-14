import React, { useState, useEffect, useCallback } from 'react';
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

    const seoProps = {
        title: t('movieList.title', 'قائمة الأفلام 2024 | أنمي شادوز - Anime Shadows'),
        description: t('movieList.description', 'تصفح مجموعتنا الواسعة من أفلام الأنمي لعام 2024 على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين.'),
        keywords: t('movieList.keywords', 'قائمة الأفلام 2024, أفلام أنمي 2024, مشاهدة أفلام اون لاين, تحميل أفلام أنمي, Anime Shadows'),
        canonicalUrl: `https://animeshadows.xyz/movie-list?page=${currentPage}`,
        ogType: 'website',
        ogImage: 'https://animeshadows.xyz/default-og-image.jpg', // Add a default OG image
        twitterImage: 'https://animeshadows.xyz/default-twitter-image.jpg', // Add a default Twitter image
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": t('movieList.title', 'قائمة الأفلام 2024 | أنمي شادوز - Anime Shadows'),
            "description": t('movieList.description', 'تصفح مجموعتنا الواسعة من أفلام الأنمي لعام 2024 على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين.'),
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
                "name": "Anime Movies 2024"
            }
        }
    };

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