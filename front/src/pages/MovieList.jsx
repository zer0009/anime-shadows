import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchMovieList from '../hooks/useFetchMovieList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
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
        title: t('movieList.title', 'قائمة الأفلام | أنمي شادوز - Anime Shadows'),
        description: t('movieList.description', 'تصفح مجموعتنا الواسعة من الأفلام على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين.'),
        keywords: t('movieList.keywords', 'قائمة الأفلام, أفلام أنمي, مشاهدة أفلام اون لاين, Anime Shadows'),
        canonicalUrl: `https://animeshadows.xyz/movie-list?page=${currentPage}`,
        ogType: 'website',
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": t('movieList.title', 'قائمة الأفلام | أنمي شادوز - Anime Shadows'),
            "description": t('movieList.description', 'تصفح مجموعتنا الواسعة من الأفلام على أنمي شادوز. اكتشف أفلامك المفضلة وشاهدها اونلاين.'),
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
                "name": "Anime Movies"
            }
        }
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
                <meta name="robots" content="index, follow" />
            </Helmet>
            {seo.jsonLd && <JsonLd item={seo.jsonLd} />}
            
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
        </>
    );
};

export default MovieList;