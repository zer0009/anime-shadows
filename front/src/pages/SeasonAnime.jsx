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
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
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
    title: t('seasonAnime.pageTitle', `أنمي موسم {{season}} {{year}} | أنمي شادوز`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    description: t('seasonAnime.pageDescription', `اكتشف أحدث إصدارات الأنمي لموسم {{season}} {{year}}. شاهد الأنميات الجديدة والمثيرة على أنمي شادوز.`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    keywords: t('seasonAnime.pageKeywords', `ربيع,خريف,شتاء,صيف,أنمي 2024, أنمي الموسم, {{season}}, {{year}}, أنميات جديدة, Anime Shadows, تحميل, مترجم, انمي, حلقة, ستريم, بث مباشر, جودة عالية, HD, مترجم عربي, دبلجة عربية, بدون إعلانات, مجاناً`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    canonicalUrl: `https://animeshadows.xyz/season-anime?page=${currentPage}`,
    ogType: "website",
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
          "url": `https://animeshadows.xyz/anime/${anime._id}`,
          "name": anime.title
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": t('seasonAnime.pageTitle', `أنمي موسم {{season}} {{year}} | أنمي شادوز`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
        "description": t('seasonAnime.pageDescription', `اكتشف أحدث إصدارات الأنمي لموسم {{season}} {{year}}. شاهد الأنميات الجديدة والمثيرة على أنمي شادوز.`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
        "url": `https://animeshadows.xyz/season-anime?page=${currentPage}`
      }
    ]
  }), [t, currentSeason, currentYear, currentPage, seasonAnimeList]);

  const seo = useSEO(seoProps);

  return (
    <Box className={styles.seasonAnimePage}>
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
        {seo.jsonLd && seo.jsonLd.map((item, index) => (
          <JsonLd key={index} item={item} />
        ))}
        
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
  );
};

export default SeasonAnime;