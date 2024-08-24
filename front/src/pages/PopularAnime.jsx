import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPopularAnime } from '../api/modules/anime';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './PopularAnime.module.css';

const PopularAnime = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 25; // Set the limit to 25

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPopularAnime('all', currentPage, limit);
      setAnimeList(response.sortedAnimes || []);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      setError(t('popularAnime.fetchError', 'Error fetching popular anime'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const seoProps = useMemo(() => ({
    title: t('popularAnime.pageTitle', `الأنميات الشائعة - الصفحة ${currentPage} | أنمي شادوز - Anime Shadows`),
    description: t('popularAnime.pageDescription', `اكتشف أشهر وأفضل الأنميات على أنمي شادوز. قائمة محدثة بأكثر الأنميات شعبية ومشاهدة. الصفحة ${currentPage} من ${totalPages}.`),
    keywords: t('popularAnime.pageKeywords', `أنمي شائع, أفضل الأنميات, قائمة الأنميات الشهيرة, أنمي شادوز, الصفحة ${currentPage}, أنمي ${new Date().getFullYear()}`),
    canonicalUrl: `https://animeshadows.xyz/popular-anime?page=${currentPage}`,
    ogType: 'website',
    ogImage: 'https://animeshadows.xyz/popular-anime-og-image.jpg',
    twitterImage: 'https://animeshadows.xyz/popular-anime-twitter-image.jpg',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('popularAnime.pageTitle', `الأنميات الشائعة - الصفحة ${currentPage} | أنمي شادوز - Anime Shadows`),
      "description": t('popularAnime.pageDescription', `اكتشف أشهر وأفضل الأنميات على أنمي شادوز. قائمة محدثة بأكثر الأنميات شعبية ومشاهدة. الصفحة ${currentPage} من ${totalPages}.`),
      "url": `https://animeshadows.xyz/popular-anime?page=${currentPage}`,
      "inLanguage": "ar",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز",
        "url": "https://animeshadows.xyz"
      },
      "about": {
        "@type": "Thing",
        "name": "Popular Anime"
      },
      "itemListElement": animeList.map((anime, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://animeshadows.xyz/anime/${anime.slug}`,
        "name": anime.title
      }))
    }
  }), [t, currentPage, totalPages, animeList]);

  const seo = useSEO(seoProps);

  return (
    <>
      {seo && (
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
        </>
      )}

      <div className={styles.popularAnimePage}>
        <Container maxWidth="lg">
          <BreadcrumbsComponent
            links={[]}
            current={t('popularAnime.heading', 'الأنميات الشائعة')}
          />
          <ListDisplay
            title={t('popularAnime.listTitle', 'الأنميات الشائعة')}
            list={animeList}
            loading={loading}
            error={error}
            fields={['title', 'genre', 'rating', 'type', 'status']}
          />

          <Box className={styles.paginationContainer}>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Container>
      </div>
    </>
  );
};

export default PopularAnime;