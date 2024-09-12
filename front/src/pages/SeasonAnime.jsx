import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Grid } from '@mui/material';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import AnimeCard from '../components/AnimeCard/AnimeCard';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { getCurrentSeason } from '../utils/getCurrentSeason';
import { HelmetProvider } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import styles from './SeasonAnime.module.css';

const SeasonAnime = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList(1, 36); // Increased to 36 items per page
  const currentSeason = getCurrentSeason();
  const currentYear = new Date().getFullYear();

  const translatedSeason = useMemo(() => t(`seasons.${currentSeason.toLowerCase()}`), [t, currentSeason]);

  useEffect(() => {
    handleSearch('', [], '', currentSeason, currentYear.toString(), '', '', false, currentPage, 36);
  }, [currentPage, currentSeason, currentYear, handleSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const seoProps = useMemo(() => ({
    title: t('seasonAnime.pageTitle', { season: translatedSeason, year: currentYear }),
    description: t('seasonAnime.pageDescription', { season: translatedSeason, year: currentYear }),
    keywords: t('seasonAnime.pageKeywords', { season: translatedSeason, year: currentYear }),
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
        "itemListElement": animeList.map((anime, index) => ({
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
        "name": t('seasonAnime.heading', { season: translatedSeason, year: currentYear }),
        "description": t('seasonAnime.description', { season: translatedSeason, year: currentYear }),
        "url": `https://animeshadows.xyz/season-anime?page=${currentPage}`,
        "hasPart": animeList.map(anime => ({
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
            "name": t('seasonAnime.heading', { season: translatedSeason, year: currentYear }),
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
  }), [t, translatedSeason, currentYear, currentPage, animeList]);

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box className={styles.seasonAnimePage}>
        <Container maxWidth="xl">
          <BreadcrumbsComponent
            links={[]}
            current={t('seasonAnime.breadcrumb', 'أنمي الموسم')}
          />

          <Typography variant="h1" className={styles.pageTitle}>
            {t('seasonAnime.heading', { season: translatedSeason, year: currentYear })}
          </Typography>

          {loading ? (
            <Typography>{t('common.loading')}</Typography>
          ) : error ? (
            <Typography color="error">{t('common.error')}</Typography>
          ) : (
            <>
              <Grid container spacing={2}>
                {animeList.map((anime) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={anime._id}>
                    <AnimeCard anime={anime} />
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

export default SeasonAnime;