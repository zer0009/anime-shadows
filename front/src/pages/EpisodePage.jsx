import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEpisodeById, fetchEpisodesByAnimeId } from '../api/modules/episode';
import { Typography, Box, Tabs, Tab, Paper, Button, List, ListItem, ListItemText, Grid, Chip } from '@mui/material';
import ReactPlayer from 'react-player';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './EpisodePage.module.css';

const EpisodePage = () => {
  const { episodeId } = useParams();
  const { t, i18n } = useTranslation();
  const [episode, setEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    const getEpisodeDetails = async () => {
      try {
        const response = await fetchEpisodeById(episodeId);
        setEpisode(response);
      } catch (error) {
        console.error(`Error fetching episode details: ${error}`);
      }
    };
    getEpisodeDetails();
  }, [episodeId]);

  useEffect(() => {
    const getEpisodes = async () => {
      if (episode?.anime?._id) {
        try {
          const response = await fetchEpisodesByAnimeId(episode.anime._id);
          setEpisodes(response);
        } catch (error) {
          console.error(`Error fetching episodes: ${error}`);
        }
      }
    };
    getEpisodes();
  }, [episode?.anime?._id]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setEmbedError(false); // Reset embed error when changing tabs
  };

  const handleEmbedError = () => {
    setEmbedError(true);
  };

  const isReactPlayerSupported = (url) => {
    return ReactPlayer.canPlay(url);
  };

  const renderVideoPlayer = (url) => {
    if (isReactPlayerSupported(url)) {
      return (
        <ReactPlayer
          url={url}
          controls={true}
          width="100%"
          height="500px"
          onError={handleEmbedError}
        />
      );
    } else {
      return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, overflow: 'hidden' }}
            src={url}
            frameBorder="0"
            allow="autoplay; fullscreen"
            title="Video Player"
            onError={handleEmbedError}
          />
        </div>
      );
    }
  };

  const seoProps = episode ? {
    title: `${episode.anime.title} - الحلقة ${episode.number} | أنمي شادوز - Anime Shadows`,
    description: `شاهد ${episode.anime.title} الحلقة ${episode.number} اون لاين على أنمي شادوز (Anime Shadows). ${episode.description?.substring(0, 150) || ''}`,
    keywords: `${episode.anime.title}, الحلقة ${episode.number}, مشاهدة اون لاين, أنمي, Anime Shadows`,
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
  } : null;

  const seo = useSEO(seoProps || {});

  if (!episode) {
    return <div>{t('episodePage.loading')}</div>;
  }

  if ((!episode.streamingServers || episode.streamingServers.length === 0) &&
      (!episode.downloadServers || episode.downloadServers.length === 0)) {
    return <div>{t('episodePage.noServers')}</div>;
  }

  const embedUrl = episode.streamingServers[selectedTab]?.url || episode.streamingServers[0]?.url;

  const groupDownloadsByQuality = () => {
    const grouped = {};
    episode.downloadServers.forEach(server => {
      if (!grouped[server.quality]) {
        grouped[server.quality] = [];
      }
      grouped[server.quality].push(server);
    });
    return grouped;
  };

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
      </Helmet>
      {seo.jsonLd && <JsonLd item={seo.jsonLd} />}
      <Box className={styles.headerSection}>
        <Typography variant="h5" className={styles.animeTitle}>
          {episode.anime.title}
        </Typography>
        <Typography variant="h6" className={styles.episodeNumber}>
          {t('episodePage.episode')} {episode.number}
        </Typography>
      </Box>
      <Box className={styles.streamingSection}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="server tabs" className={styles.serverTabs}>
          {episode.streamingServers.map((server, index) => (
            <Tab key={index} label={`${server.serverName} - ${server.quality}`} className={styles.serverTab} />
          ))}
        </Tabs>
        <Paper className={styles.videoContainer}>
          {!embedError ? (
            renderVideoPlayer(embedUrl)
          ) : (
            <Button
              variant="contained"
              color="primary"
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('episodePage.watchVideo')}
            </Button>
          )}
        </Paper>
      </Box>
      <Box className={styles.episodeListSection}>
        <Typography variant="h6" className={styles.episodeListTitle}>
          {t('episodePage.allEpisodes')}
        </Typography>
        <List className={styles.episodeList}>
          {episodes.length > 0 ? (
            episodes.map((ep) => (
              <ListItem 
                key={ep._id} 
                button 
                component={Link} 
                to={`/episode/${ep._id}`} 
                className={styles.episodeItem}
                style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
              >
                <ListItemText 
                  primary={`${t('episodePage.episode')} ${ep.number}`} 
                  className={styles.episodeItemText}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={t('episodePage.loadingEpisodes')} />
            </ListItem>
          )}
        </List>
      </Box>
      <Box className={styles.downloadSection}>
        <Typography variant="h6" className={styles.downloadTitle}>
          {t('episodePage.downloadEpisode')}
        </Typography>
        <Grid container spacing={4}>
          {Object.entries(groupDownloadsByQuality()).map(([quality, servers]) => (
            <Grid item xs={12} sm={6} md={4} key={quality}>
              <Paper elevation={3} className={styles.qualityGroup} style={{ backgroundColor: 'var(--tertiary-dark)' }}>
                <Chip label={quality} color="primary" className={styles.qualityChip} />
                {servers.map((server, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    className={styles.downloadButton}
                    href={server.url}
                    download
                    startIcon={<GetAppIcon />}
                  >
                   {server.serverName}
                  </Button>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default EpisodePage;