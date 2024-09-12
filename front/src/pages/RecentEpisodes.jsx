import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress, Alert, Container } from '@mui/material';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './RecentEpisodes.module.css';

const RecentEpisodes = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const { recentEpisodes, loading, error, totalPages, setCurrentPage } = useFetchRecentEpisodes(currentPage, 36); // 36 items per page

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setCurrentPage, setSearchParams]);

  const handleAnimeClick = useCallback((slug, episodeNumber) => {
    // Navigate to the episode page
    window.location.href = `/anime/${slug}/episode/${episodeNumber}`;
  }, []);

  const seoProps = useMemo(() => ({
    title: t('recentEpisodes.pageTitle'),
    description: t('recentEpisodes.pageDescription'),
    keywords: t('recentEpisodes.pageKeywords'),
    canonicalUrl: `https://animeshadows.xyz/recent-episodes?page=${currentPage}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/default-og-image.jpg",
    twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('recentEpisodes.pageTitle'),
      "description": t('recentEpisodes.pageDescription'),
      "url": `https://animeshadows.xyz/recent-episodes?page=${currentPage}`,
      "inLanguage": "ar",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز",
        "url": "https://animeshadows.xyz"
      },
      "numberOfItems": recentEpisodes.length,
      "itemListElement": recentEpisodes.map((episode, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://animeshadows.xyz/episode/${episode._id}`
      }))
    }
  }), [t, currentPage, recentEpisodes]);

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box className={styles.recentEpisodesPage}>
        <Container maxWidth="xl">
          <Box className={styles.breadcrumbsContainer}>
            <BreadcrumbsComponent
              links={[
                { to: "/anime-list", label: t('common.animeList') }
              ]}
              current={t('recentEpisodes.breadcrumb')}
            />
          </Box>
                
          <Typography variant="h1" className={styles.pageTitle}>
            {t('recentEpisodes.heading')}
          </Typography>

          {loading ? (
            <Box className={styles.loader}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" className={styles.errorMessage}>
              {t('common.error')}
            </Alert>
          ) : (
            <>
              <Grid container spacing={2}>
                {Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={episode._id}>
                    <AnimeCard
                      anime={episode.anime}
                      episodeNumber={episode.number}
                      episodeId={episode._id}
                      availableSubtitles={episode.availableSubtitles}
                      onClick={() => handleAnimeClick(episode.anime.slug, episode.number)}
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

export default RecentEpisodes;