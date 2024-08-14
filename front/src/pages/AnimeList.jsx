import React, { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Box, Typography, Container } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';

const AnimeList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage, 25); // Ensure limit is 25
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setSearchParams]);

  const seoProps = useMemo(() => ({
    title: t('animeList.pageTitle', "قائمة الأنمي - Anime Shadows"),
    description: t('animeList.pageDescription', "تصفح مجموعتنا الواسعة من مسلسلات الأنمي على أنمي شادوز (Anime Shadows). اعثر على مسلسلك المفضل القادم."),
    keywords: t('animeList.pageKeywords', "قائمة الأنمي, مسلسلات أنمي, مشاهدة أنمي اون لاين, Anime Shadows, أفضل أنمي, أنمي جديد, أنمي مترجم, تحميل أنمي, أنمي 2024"),
    canonicalUrl: `https://animeshadows.xyz/anime-list?page=${currentPage}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/default-og-image.jpg", // Add a default OG image
    twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg", // Add a default Twitter image
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
  }), [animeList, currentPage, t]);

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
            links={[]}
            current={t('animeList.breadcrumb', 'قائمة الأنمي')}
          />
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
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
            </>
          )}
        </Container>
      </Box>
    </HelmetProvider>
  );
};

export default AnimeList;