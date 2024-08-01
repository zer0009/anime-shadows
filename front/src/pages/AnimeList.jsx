import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography, Container, Breadcrumbs } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import styles from './AnimeList.module.css';

const AnimeList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage);
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setSearchParams]);

  const seoProps = {
    title: t('animeList.pageTitle', "قائمة الأنمي | أنمي شادوز - Anime Shadows"),
    description: t('animeList.pageDescription', "تصفح مجموعتنا الواسعة من مسلسلات الأنمي على أنمي شادوز (Anime Shadows). اعثر على مسلسلك المفضل القادم."),
    keywords: t('animeList.pageKeywords', "قائمة الأنمي, مسلسلات أنمي, مشاهدة أنمي اون لاين, Anime Shadows"),
    canonicalUrl: `https://animeshadows.xyz/anime-list?page=${currentPage}`,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('animeList.pageTitle', "قائمة الأنمي | أنمي شادوز - Anime Shadows"),
      "description": t('animeList.pageDescription', "تصفح مجموعتنا الواسعة من مسلسلات الأنمي على أنمي شادوز (Anime Shadows). اعثر على مسلسلك المفضل القادم."),
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
            {t('animeList.breadcrumb', 'قائمة الأنمي')}
          </Typography>
        </Breadcrumbs>
                
        <ListDisplay
          title={t('animeList.listTitle', 'قائمة الأنمي')}
          list={animeList}
          loading={loading}
          error={error}
          fields={['title', 'genre', 'rating']}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AnimeList;