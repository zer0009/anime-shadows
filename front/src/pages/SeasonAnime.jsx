import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Chip, Paper, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { getCurrentSeason } from '../utils/getCurrentSeason';
import { HelmetProvider } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './SeasonAnime.module.css';

const SeasonAnime = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();
  const currentSeason = getCurrentSeason();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    handleSearch('', [], '', currentSeason, currentYear.toString(), '', '', false, currentPage);
  }, [currentPage, currentSeason, currentYear, handleSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const seasonAnimeList = animeList.filter(anime => 
    anime.season && 
    anime.season.name.toLowerCase() === currentSeason.toLowerCase()
  );

  const seoProps = useMemo(() => ({
    title: t('seasonAnime.pageTitle', `أنمي موسم ${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear} | أنمي شادوز`),
    description: t('seasonAnime.pageDescription', `اكتشف أحدث إصدارات الأنمي لموسم ${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear}. شاهد الأنميات الجديدة والمثيرة على أنمي شادوز. قائمة شاملة لجميع الأنميات المعروضة هذا الموسم مع تفاصيل وتصنيفات.`),
    keywords: t('seasonAnime.pageKeywords', `ربيع, خريف, شتاء, صيف, أنمي ${currentYear}, أنمي الموسم, ${t(`seasons.${currentSeason}`, currentSeason)}, ${currentYear}, أنميات جديدة, Anime Shadows, تحميل, مترجم, انمي, حلقة, ستريم, بث مباشر, جودة عالية, HD, مترجم عربي, دبلجة عربية, بدون إعلانات, مجاناً, قائمة الأنمي, مواعيد العرض, تصنيفات الأنمي, أنمي رومانسي, أنمي أكشن, أنمي خيال علمي, أنمي كوميدي, أنمي دراما`),
    canonicalUrl: `https://animeshadows.xyz/season-anime?page=${currentPage}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/season-anime-og-image.jpg",
    twitterImage: "https://animeshadows.xyz/season-anime-twitter-image.jpg",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز",
        "url": "https://animeshadows.xyz",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://animeshadows.xyz/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": seasonAnimeList.map((anime, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "TVSeries",
            "url": `https://animeshadows.xyz/anime/${anime.slug}`,
            "name": anime.title,
            "image": anime.coverImage,
            "genre": anime.genres,
            "numberOfEpisodes": anime.episodeCount,
            "datePublished": anime.startDate,
            "inLanguage": "ja",
            "subtitleLanguage": "ar"
          }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": t('seasonAnime.pageTitle', `أنمي موسم ${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear} | أنمي شادوز`),
        "description": t('seasonAnime.pageDescription', `اكتشف أحدث إصدارات الأنمي لموسم ${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear}. شاهد الأنميات الجديدة والمثيرة على أنمي شادوز.`),
        "url": `https://animeshadows.xyz/season-anime?page=${currentPage}`,
        "hasPart": seasonAnimeList.map(anime => ({
          "@type": "TVSeries",
          "url": `https://animeshadows.xyz/anime/${anime.slug}`,
          "name": anime.title,
          "image": anime.coverImage,
          "genre": anime.genres,
          "numberOfEpisodes": anime.episodeCount,
          "datePublished": anime.startDate
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "الرئيسية",
            "item": "https://animeshadows.xyz"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": t('seasonAnime.breadcrumb', 'أنمي الموسم'),
            "item": "https://animeshadows.xyz/season-anime"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear}`,
            "item": `https://animeshadows.xyz/season-anime?page=${currentPage}`
          }
        ]
      }
    ],
    language: 'ar',
    alternateLanguages: [
      { lang: 'en', url: `https://animeshadows.xyz/en/season-anime?page=${currentPage}` }
    ],
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    section: 'Seasonal Anime'
  }), [t, currentSeason, currentYear, currentPage, seasonAnimeList]);

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box className={styles.seasonAnimePage}>
        <Container maxWidth="lg">
          <BreadcrumbsComponent
            links={[]}
            current={t('seasonAnime.breadcrumb', 'أنمي الموسم')}
          />

          <ListDisplay
            title={t('seasonAnime.listTitle', 'قائمة أنمي الموسم')}
            list={seasonAnimeList}
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
      </Box>
    </HelmetProvider>
  );
};

export default SeasonAnime;