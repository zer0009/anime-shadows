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

    const seoProps = useMemo(() => ({
        title: t('movieList.title', `قائمة أفلام الأنمي ${new Date().getFullYear()} | أنمي شادوز - Anime Shadows`),
        description: t('movieList.description', `تصفح مجموعتنا الواسعة من أفلام الأنمي لعام ${new Date().getFullYear()} على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين بجودة عالية ومترجمة للعربية. قائمة شاملة لأحدث وأفضل أفلام الأنمي.`),
        keywords: t('movieList.keywords', `قائمة الأفلام ${new Date().getFullYear()}, أفلام أنمي ${new Date().getFullYear()}, مشاهدة أفلام اون لاين, تحميل أفلام أنمي, Anime Shadows, أنمي شادوز, أفلام أنمي مترجمة, أفلام أنمي مدبلجة, أفلام أنمي عربي, أفلام أنمي HD, أفلام أنمي جديدة, أفلام أنمي رومانسية, أفلام أنمي أكشن, أفلام أنمي مغامرات, أفلام أنمي خيال علمي, أفلام أنمي كوميدي`),
        canonicalUrl: `https://animeshadows.xyz/movie-list?page=${currentPage}`,
        ogType: 'website',
        ogImage: 'https://animeshadows.xyz/anime-movies-og-image.jpg',
        twitterImage: 'https://animeshadows.xyz/anime-movies-twitter-image.jpg',
        jsonLd: [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": t('movieList.title', `قائمة أفلام الأنمي ${new Date().getFullYear()} | أنمي شادوز - Anime Shadows`),
                "description": t('movieList.description', `تصفح مجموعتنا الواسعة من أفلام الأنمي لعام ${new Date().getFullYear()} على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين.`),
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
                    "name": `Anime Movies ${new Date().getFullYear()}`
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
    }), [t, currentPage, movieList]);

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