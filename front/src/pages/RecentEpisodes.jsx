import React, { useState, useEffect, useCallback } from 'react';
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
  const { recentEpisodes, loading, error, totalPages, setCurrentPage } = useFetchRecentEpisodes(currentPage, 25);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setCurrentPage, setSearchParams]);

  const seoProps = {
    title: t('recentEpisodes.pageTitle', "Anime Shadows - الحلقات المحدثة مؤخرًا"),
    description: t('recentEpisodes.pageDescription', "استعرض أحدث الحلقات المحدثة على أنمي شادوز (Anime Shadows)."),
    keywords: t('recentEpisodes.pageKeywords', "الحلقات المحدثة, أنمي, مشاهدة أنمي اون لاين, Anime Shadows, أنمي شادوز"),
    canonicalUrl: `https://animeshadows.xyz/recent-episodes?page=${currentPage}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/default-og-image.jpg", // Add a default OG image
    twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg", // Add a default Twitter image
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('recentEpisodes.pageTitle', "Anime Shadows - الحلقات المحدثة مؤخرًا"),
      "description": t('recentEpisodes.pageDescription', "استعرض أحدث الحلقات المحدثة على أنمي شادوز (Anime Shadows)."),
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
  };

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box sx={{ 
        backgroundColor: 'var(--primary-dark)', 
        color: 'var(--text-color)',
        minHeight: '100vh',
        padding: '20px 0'
      }}>
        <Container maxWidth="lg">
          <BreadcrumbsComponent
            links={[
              { to: "/anime-list", label: t('common.animeList', 'قائمة الأنمي') }
            ]}
            current={t('recentEpisodes.breadcrumb', 'الحلقات المحدثة مؤخرًا')}
          />
                
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            {t('recentEpisodes.pageTitle', 'الحلقات المحدثة مؤخرًا')}
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}
          {!loading && !error && (
            <>
              <Grid container spacing={1} className={styles.grid}>
                {Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.3} key={episode._id}>
                    <AnimeCard
                      anime={episode.anime}
                      episodeNumber={episode.number}
                      onClick={() => {
                        console.log(`Clicked on episode with id: ${episode.anime._id}`);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
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