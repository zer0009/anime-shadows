import React, { useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEpisodeBySlugAndNumber, fetchEpisodesByAnimeId } from '../api/modules/episode';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './EpisodePage.module.css';
import { handleMarkAsWatched } from '../utils/episodeUtils';
import AdComponent from '../components/AdComponent/AdComponent'; // Import AdComponent
import { useAuth } from '../context/AuthContext'; // Import useAuth

const HeaderSection = lazy(() => import('../components/Episode/HeaderSection'));
const StreamingSection = lazy(() => import('../components/Episode/StreamingSection'));
const EpisodeListSection = lazy(() => import('../components/Episode/EpisodeListSection'));
const DownloadSection = lazy(() => import('../components/Episode/DownloadSection'));

const EpisodePage = () => {
  const { episodeSlug } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth(); // Get user from useAuth
  const [episode, setEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [embedError, setEmbedError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [slug, episodeNumber] = episodeSlug.split('-الحلقة-');

  const isAdminOrModerator = user && (user.role === 'admin' || user.role === 'moderator');

  useEffect(() => {
    const getEpisodeDetails = async () => {
      try {
        const response = await fetchEpisodeBySlugAndNumber(slug, episodeNumber);
        setEpisode(response);
        if (localStorage.getItem('user')) { // Check if user is logged in
          handleMarkAsWatched(response.anime._id, response._id); // Assuming these are the correct IDs
        }
      } catch (error) {
        console.error(`Error fetching episode details: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    getEpisodeDetails();
  }, [slug, episodeNumber]);

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
    getEpisodes();
  }, [getEpisodes]);

  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
    setEmbedError(false); // Reset embed error when changing tabs
  }, []);

  const handleEmbedError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const embedUrl = episode?.streamingServers?.[selectedTab]?.url || episode?.streamingServers?.[0]?.url;

  const seoProps = useMemo(() => episode ? {
    title: `AnimeShadows - مترجمة اون لاين ${episode.anime.title} الحلقة ${episode.number} مشاهدة الأنمي`,
    description: `شاهد ${episode.anime.title} الحلقة ${episode.number} مترجمة اون لاين بجودة عالية على أنمي شادوز (Anime Shadows). ${episode.description?.substring(0, 150) || ''} استمتع بأحدث حلقات الأنمي مع خيارات متعددة للمشاهدة والتحميل.`,
    keywords: `${episode.anime.title}, الحلقة ${episode.number}, أنمي ${new Date().getFullYear()}, مشاهدة اون لاين, تحميل, مترجم, أنمي, Anime Shadows, انمي, حلقة, ستريم, بث مباشر, جودة عالية, HD, FHD, 4K, 360p, 480p, 720p, 1080p, جودة منخفضة, مترجم عربي, بدون إعلانات, مجاناً, ${episode.anime.genres?.join(', ')}, أنمي شادوز, حلقة جديدة, أنمي مترجم, مشاهدة مباشرة, تحميل مباشر, سيرفرات متعددة, ترجمة احترافية`,
    canonicalUrl: `https://animeshadows.xyz/episode/${episodeSlug}`,
    ogType: 'video.episode',
    ogImage: episode.anime.pictureUrl,
    twitterImage: episode.anime.pictureUrl,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TVEpisode",
        "name": `${episode.anime.title} - الحلقة ${episode.number}`,
        "episodeNumber": episode.number,
        "seasonNumber": episode.season || 1,
        "partOfSeries": {
          "@type": "TVSeries",
          "name": episode.anime.title,
          "image": episode.anime.pictureUrl,
          "genre": episode.anime.genres,
        },
        "description": episode.description,
        "image": episode.anime.pictureUrl,
        "url": `https://animeshadows.xyz/episode/${episodeSlug}`,
        "potentialAction": {
          "@type": "WatchAction",
          "target": `https://animeshadows.xyz/episode/${episodeSlug}`
        },
        "inLanguage": "ar",
        "subtitleLanguage": "ar",
        "datePublished": episode.releaseDate || new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "Anime Shadows",
          "alternateName": "أنمي شادوز",
          "url": "https://animeshadows.xyz",
          "logo": {
            "@type": "ImageObject",
            "url": "https://animeshadows.xyz/logo.png"
          }
        }
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
            "name": episode.anime.title,
            "item": `https://animeshadows.xyz/anime/${episode.anime.slug}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `الحلقة ${episode.number}`,
            "item": `https://animeshadows.xyz/episode/${episodeSlug}`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": `${episode.anime.title} - الحلقة ${episode.number}`,
        "description": episode.description,
        "thumbnailUrl": episode.anime.pictureUrl,
        "uploadDate": episode.releaseDate || new Date().toISOString(),
        "duration": `PT${episode.duration || 24}M`,
        "contentUrl": `https://animeshadows.xyz/episode/${episodeSlug}`,
        "embedUrl": embedUrl,
        "inLanguage": "ja",
        "subtitleLanguage": "ar",
        "genre": episode.anime.genres,
        "actor": episode.anime.characters?.map(character => ({
          "@type": "Person",
          "name": character.name
        }))
      }
    ]
  } : null, [episode, episodeSlug, embedUrl]);

  useSEO(seoProps || {});

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

  return (
    <HelmetProvider>
      <div className={`${styles.episodePage} ${i18n.language === 'ar' ? styles.rtl : styles.ltr}`}>
        {seoProps.jsonLd && <JsonLd item={seoProps.jsonLd} />}
        <AdComponent adKey="ea9ea029a7a095b803da9b265289a2fe" format="iframe" height={90} width={728} showAd={!isAdminOrModerator} /> {/* Top Banner Ad */}
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
            <AdComponent adKey="d3b3d418ac4671f3a58fb377907a15ef" format="iframe" height={250} width={300} showAd={!isAdminOrModerator} /> {/* In-Content Ad */}
            <Box className={styles.episodeListSection}>
              <EpisodeListSection episodes={episodes} i18n={i18n} t={t} />
            </Box>
          </Box>
        </Suspense>
        <DownloadSection episode={episode} t={t} />
        <AdComponent adKey="ea9ea029a7a095b803da9b265289a2fe" format="iframe" height={90} width={728} showAd={!isAdminOrModerator} /> {/* Bottom Banner Ad */}
      </div>
    </HelmetProvider>
  );
};

export default EpisodePage;