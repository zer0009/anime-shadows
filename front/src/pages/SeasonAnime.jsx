import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container, Breadcrumbs, Link, Chip, Paper, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { getCurrentSeason } from '../utils/getCurrentSeason';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
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

  const seoProps = {
    title: t('seasonAnime.pageTitle', `أنمي موسم {{season}} {{year}} | أنمي شادوز`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    description: t('seasonAnime.pageDescription', `اكتشف أحدث إصدارات الأنمي لموسم {{season}} {{year}}. شاهد الأنميات الجديدة والمثيرة على أنمي شادوز.`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    keywords: t('seasonAnime.pageKeywords', `أنمي الموسم, {{season}}, {{year}}, أنميات جديدة, Anime Shadows, تحميل, مترجم, انمي, حلقة, ستريم, بث مباشر, جودة عالية, HD, مترجم عربي, دبلجة عربية, بدون إعلانات, مجاناً`, { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear }),
    canonicalUrl: `https://animeshadows.xyz/season-anime?page=${currentPage}`,
    ogType: "website",
  };

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
        </Helmet>
        {seo.jsonLd && <JsonLd item={seo.jsonLd} />}
        
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" className={styles.breadcrumbSeparator} />}
          aria-label="breadcrumb" 
          className={styles.breadcrumbs}
        >
          <Link 
            component={RouterLink} 
            to="/" 
            className={styles.breadcrumbLink}
          >
            <HomeIcon className={styles.breadcrumbIcon} />
            <Typography variant="body2">{t('common.home', 'الرئيسية')}</Typography>
          </Link>
          <Typography variant="body2" className={styles.breadcrumbCurrent}>
            {t('seasonAnime.breadcrumb', 'أنمي الموسم')}
          </Typography>
        </Breadcrumbs>

        <Paper elevation={3} className={styles.headerPaper}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h1" className={styles.pageTitle}>
                {t('seasonAnime.heading', 'أنمي موسم {{season}} {{year}}', { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear })}
              </Typography>
              <Typography variant="body1" className={styles.pageDescription}>
                {t('seasonAnime.description', 'اكتشف أحدث إصدارات الأنمي لموسم {{season}} {{year}}. استمتع بمشاهدة الأنميات الجديدة والمثيرة.', { season: t(`seasons.${currentSeason}`, currentSeason), year: currentYear })}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={styles.chipContainer}>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`${t(`seasons.${currentSeason}`, currentSeason)} ${currentYear}`}
                  className={styles.seasonChip}
                />
                <Chip
                  icon={<LocalFireDepartmentIcon />}
                  label={t('seasonAnime.trendingNow', 'الأكثر رواجًا')}
                  className={styles.trendingChip}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Divider className={styles.divider} />

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