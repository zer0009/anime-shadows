import React, { useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEpisodeById, fetchEpisodesByAnimeId } from '../api/modules/episode';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './EpisodePage.module.css';

const HeaderSection = lazy(() => import('../components/Episode/HeaderSection'));
const StreamingSection = lazy(() => import('../components/Episode/StreamingSection'));
const EpisodeListSection = lazy(() => import('../components/Episode/EpisodeListSection'));
const DownloadSection = lazy(() => import('../components/Episode/DownloadSection'));

const EpisodePage = () => {
  const { episodeId } = useParams();
  const { t, i18n } = useTranslation();
  const [episode, setEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [embedError, setEmbedError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getEpisodeDetails = useCallback(async () => {
    try {
      const response = await fetchEpisodeById(episodeId);
      setEpisode(response);
    } catch (error) {
      console.error(`Error fetching episode details: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  const getEpisodes = useCallback(async () => {
    if (episode?.anime?._id) {
      try {
        const response = await fetchEpisodesByAnimeId(episode.anime._id);
        setEpisodes(response);
      } catch (error) {
        console.error(`Error fetching episodes: ${error}`);
      }
    }
  }, [episode?.anime?._id]);

  useEffect(() => {
    getEpisodeDetails();
  }, [getEpisodeDetails]);

  useEffect(() => {
    getEpisodes();
  }, [getEpisodes]);

  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
    setEmbedError(false); // Reset embed error when changing tabs
  }, []);

  const handleEmbedError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const seoProps = useMemo(() => episode ? {
    title: `${episode.anime.title} - الحلقة ${episode.number} | أنمي شادوز - Anime Shadows`,
    description: `شاهد ${episode.anime.title} الحلقة ${episode.number} اون لاين على أنمي شادوز (Anime Shadows). ${episode.description?.substring(0, 150) || ''}`,
    keywords: `${episode.anime.title}, الحلقة ${episode.number}, مشاهدة اون لاين, تحميل, مترجم, أنمي, Anime Shadows, انمي, حلقة, ستريم, بث مباشر, جودة عالية, HD, مترجم عربي, بدون إعلانات, مجاناً, ${episode.anime.genres?.join(', ')}`,
    canonicalUrl: `https://animeshadows.xyz/episode/${episodeId}`,
    ogType: 'video.episode',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TVEpisode",
      "name": `${episode.anime.title} - الحلقة ${episode.number}`,
      "episodeNumber": episode.number,
      "partOfSeries": {
        "@type": "TVSeries",
        "name": episode.anime.title,
      },
      "description": episode.description,
      "image": episode.anime.pictureUrl,
      "url": `https://animeshadows.xyz/episode/${episodeId}`,
      "potentialAction": {
        "@type": "WatchAction",
        "target": `https://animeshadows.xyz/episode/${episodeId}`
      },
      "inLanguage": "ar",
      "publisher": {
        "@type": "Organization",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز"
      }
    }
  } : null, [episode, episodeId]);

  const seo = useSEO(seoProps || {});

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!episode) {
    return <div>{t('episodePage.loading')}</div>;
  }

  if ((!episode.streamingServers || episode.streamingServers.length === 0) &&
      (!episode.downloadServers || episode.downloadServers.length === 0)) {
    return <div>{t('episodePage.noServers')}</div>;
  }

  const embedUrl = episode.streamingServers[selectedTab]?.url || episode.streamingServers[0]?.url;

  return (
    <div className={styles.episodePage} style={{ direction: i18n.language === 'ar' ? 'ltr' : 'rtl' }}>
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
      <Suspense fallback={<CircularProgress />}>
        <Box className={styles.mainContent}>
          <Box className={styles.streamingSection}>
            <HeaderSection episode={episode} t={t} />
            <StreamingSection
              episode={episode}
              episodes={episodes}
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
              embedError={embedError}
              handleEmbedError={handleEmbedError}
              embedUrl={embedUrl}
              t={t}
            />
          </Box>
          <Box className={styles.episodeListSection}>
            <EpisodeListSection episodes={episodes} i18n={i18n} t={t} />
          </Box>
        </Box>
      </Suspense>
      <DownloadSection episode={episode} t={t} />
    </div>
  );
};

export default EpisodePage;