import React, { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Box, Typography, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';

const AnimeList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage);
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  }, [setSearchParams]);

  const seoProps = useMemo(() => ({
    title: t('animeList.pageTitle', "قائمة الأنمي - Anime Shadows"),
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
  }), [animeList, currentPage, t]);

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
        
        {/* <BreadcrumbsComponent
          links={[
            { to: '/category', label: t('common.category', 'الفئة') },
            { to: '/subcategory', label: t('common.subcategory', 'الفئة الفرعية') }
          ]}
          current={t('animeList.breadcrumb', 'قائمة الأنمي')}
        /> */}

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
  );
};

export default AnimeList;