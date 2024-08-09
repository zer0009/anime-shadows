import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress, Alert, Breadcrumbs, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import useFetchRecentEpisodes from '../hooks/useFetchRecentEpisodes';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import styles from './RecentEpisodes.module.css';

const RecentEpisodes = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const { recentEpisodes, loading, error, totalPages, setCurrentPage } = useFetchRecentEpisodes(currentPage,16);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setCurrentPage, setSearchParams]);

  const seoProps = {
    title: t('recentEpisodes.pageTitle', "الحلقات المحدثة مؤخرًا | أنمي شادوز - Anime Shadows"),
    description: t('recentEpisodes.pageDescription', "استعرض أحدث الحلقات المحدثة على أنمي شادوز (Anime Shadows)."),
    keywords: t('recentEpisodes.pageKeywords', "الحلقات المحدثة, أنمي, مشاهدة أنمي اون لاين, Anime Shadows"),
    canonicalUrl: `https://animeshadows.xyz/recent-episodes?page=${currentPage}`,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('recentEpisodes.pageTitle', "الحلقات المحدثة مؤخرًا | أنمي شادوز - Anime Shadows"),
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

  const seo = useSEO(seoProps);

  return (
    <Box sx={{ 
      backgroundColor: 'var(--primary-dark)', 
      color: 'var(--text-color)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <Container maxWidth="lg">
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
        
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'var(--subtext-color)' }} />}
          aria-label="breadcrumb" 
          sx={{ 
            marginBottom: '20px', 
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center',
            }
          }}
        >
          <RouterLink 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'var(--subtext-color)', 
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              '&:hover': { 
                color: 'var(--highlight-color)' 
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
            <Typography variant="body2">
              {t('common.home', 'الرئيسية')}
            </Typography>
          </RouterLink>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t('recentEpisodes.breadcrumb', 'الحلقات المحدثة مؤخرًا')}
          </Typography>
        </Breadcrumbs>
                
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
            <Grid container spacing={2} className={styles.grid}>
              {Array.isArray(recentEpisodes) && recentEpisodes.map((episode) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={episode._id}>
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
  );
};

export default RecentEpisodes;