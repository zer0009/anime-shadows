import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPopularAnime } from '../api/modules/anime';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';

const PopularAnime = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPopularAnime(currentPage);
        setAnimeList(response.sortedAnimes || []);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError(t('popularAnime.fetchError', 'Error fetching popular anime'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, t]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const seoProps = {
    title: t('popularAnime.pageTitle', 'الأنميات الشائعة | أنمي شادوز - Anime Shadows'),
    description: t('popularAnime.pageDescription', 'اكتشف أشهر وأفضل الأنميات على أنمي شادوز. قائمة محدثة بأكثر الأنميات شعبية ومشاهدة.'),
    keywords: t('popularAnime.pageKeywords', 'أنمي شائع, أفضل الأنميات, قائمة الأنميات الشهيرة, أنمي شادوز'),
    canonicalUrl: `https://animeshadows.xyz/popular-anime?page=${currentPage}`,
    ogType: 'website',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('popularAnime.pageTitle', 'الأنميات الشائعة | أنمي شادوز - Anime Shadows'),
      "description": t('popularAnime.pageDescription', 'اكتشف أشهر وأفضل الأنميات على أنمي شادوز. قائمة محدثة بأكثر الأنميات شعبية ومشاهدة.'),
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
        "url": `https://animeshadows.xyz/anime/${anime._id}`,
        "name": anime.title
      }))
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
      </Helmet>
      {seo.jsonLd && <JsonLd item={seo.jsonLd} />}

      <Box sx={{ padding: '20px' }}>
        {/* <Typography variant="h1" sx={{ marginBottom: '20px', fontSize: '2.5rem' }}>
          {t('popularAnime.heading', 'الأنميات الشائعة')}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          {t('popularAnime.description', 'اكتشف أشهر وأفضل الأنميات على موقعنا. هذه القائمة تضم الأنميات الأكثر شعبية ومشاهدة من قبل مستخدمينا.')}
        </Typography> */}
        <ListDisplay
          title={t('popularAnime.listTitle', 'قائمة الأنميات الشائعة')}
          list={animeList}
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
    </>
  );
};

export default PopularAnime;