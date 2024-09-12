import React, { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Box, Typography, Container, Grid } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './AnimeList.module.css';

const AnimeList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage, 36); // Increased to 36 items per page
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setSearchParams]);

  const handleAnimeClick = useCallback((slug) => {
    window.location.href = `/anime/${slug}`;
  }, []);

  const seoProps = useMemo(() => ({
    title: t('animeList.pageTitle'),
    description: t('animeList.pageDescription'),
    keywords: t('animeList.pageKeywords'),
    canonicalUrl: `https://animeshadows.xyz/anime-list?page=${currentPage}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/default-og-image.jpg", // Add a default OG image
    twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg", // Add a default Twitter image
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('animeList.pageTitle'),
      "description": t('animeList.pageDescription'),
      "url": `https://animeshadows.xyz/anime-list?page=${currentPage}`,
      "inLanguage": "ar",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز",
        "url": "https://animeshadows.xyz"
      },
      "numberOfItems": animeList.length,
      "itemListElement": animeList.map((anime, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://animeshadows.xyz/anime/${anime.id}`
      }))
    }
  }), [animeList, currentPage, t]);

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box className={styles.animeListPage}>
        <Container maxWidth="xl">
          <BreadcrumbsComponent
            links={[]}
            current={t('animeList.breadcrumb')}
          />
          
          <Typography variant="h1" className={styles.pageTitle}>
            {t('animeList.listTitle')}
          </Typography>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Typography color="error" className={styles.errorMessage}>
              {t('common.error')}
            </Typography>
          ) : (
            <>
              <Grid container spacing={2}>
                {animeList.map((anime) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={anime._id}>
                    <AnimeCard
                      anime={anime}
                      onClick={() => handleAnimeClick(anime.slug)}
                    />
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

export default AnimeList;