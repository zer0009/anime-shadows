import React, { useCallback, Suspense, lazy, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import useFetchUserData from '../hooks/useFetchUserData';
import { useSEO } from '../hooks/useSEO';
import { addFavorite, removeFavorite } from '../api/modules/user';
import { rateAnime } from '../api/modules/anime';
import useAnimeDetails from '../hooks/useAnimeDetails';
import styles from './AnimeDetails.module.css';

const AnimeSidebar = lazy(() => import('../components/AnimeDetails/AnimeSidebar.jsx'));
const AnimeMainContent = lazy(() => import('../components/AnimeDetails/AnimeMainContent.jsx'));
const RatingDialog = lazy(() => import('../components/AnimeDetails/RatingDialog.jsx'));
const AnimeTabs = lazy(() => import('../components/AnimeDetails/AnimeTabs.jsx'));
const AnimeEpisodes = lazy(() => import('../components/AnimeDetails/AnimeEpisodes.jsx'));

const AnimeDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const { userData } = useFetchUserData();

  const {
    anime,
    loading,
    error,
    isFavorite,
    userRating,
    viewingHistory,
    myAnimeListData,
    setIsFavorite,
    setUserRating,
  } = useAnimeDetails(slug, userData);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFavoriteClick = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to favorite');
        setSnackbarOpen(true);
        return;
      }
      if (isFavorite) {
        await removeFavorite(anime._id);
      } else {
        await addFavorite(anime._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }, [isFavorite, anime]);

  const openModal = useCallback((episode) => {
    navigate(`/episode/${slug}-الحلقة-${episode.number}`);
  }, [navigate, slug]);

  const handleGenreClick = useCallback((genreId) => {
    navigate(`/filter/genre/${genreId}`);
  }, [navigate]);

  const handleRateAnime = useCallback(() => {
    setRatingDialogOpen(true);
  }, []);

  const submitRating = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to rate');
        setSnackbarOpen(true);
        return;
      }
      await rateAnime(anime._id, user._id, selectedRating);
      setUserRating(selectedRating);
      setSnackbarMessage('Rating submitted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error rating anime:', error);
      setSnackbarMessage('Error submitting rating');
      setSnackbarOpen(true);
    }
  }, [selectedRating, anime]);

  const removeRating = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to remove rating');
        setSnackbarOpen(true);
        return;
      }
      await rateAnime(anime._id, user._id, null);
      setUserRating(null);
      setSnackbarMessage('Rating removed successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing rating:', error);
      setSnackbarMessage('Error removing rating');
      setSnackbarOpen(true);
    }
  }, [anime]);

  const getScoreDisplayProps = useCallback(() => ({
    score: myAnimeListData ? myAnimeListData.myAnimeListRating : 0,
    userCount: myAnimeListData ? myAnimeListData.myAnimeListUserCount : 0
  }), [myAnimeListData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const seoProps = useMemo(() => {
    if (!anime) return { title: 'Loading...' };
    return {
      title: `جميع حلقات انمي ${anime.title} مترجمة اون لاين - AnimeShadows`,
      description: `شاهد ${anime.title} - ${anime.subTitle} اون لاين على أنمي شادوز (Anime Shadows). ${anime.description?.substring(0, 150)}...`,
      keywords: `أنمي 2024, ${anime.title}, ${anime.subTitle}, ${anime.genres?.map(genre => genre.name).join(', ')}, أنمي مترجم, مشاهدة أنمي, تحميل أنمي, أنمي جديد, أفضل أنمي, أنمي أون لاين, حلقات أنمي, أفلام أنمي, أنمي بدون إعلانات, أنمي بالعربي, أنمي رومانسي, أنمي أكشن, أنمي كوميدي, أنمي دراما, أنمي مغامرات, أنمي خيال علمي, أنمي فانتازيا`,
      canonicalUrl: `https://animeshadows.xyz/anime/${slug}`,
      ogType: 'video.tv_show',
      ogImage: anime.pictureUrl,
      twitterImage: anime.pictureUrl,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "name": anime.title,
        "alternateName": anime.subTitle,
        "description": anime.description,
        "image": anime.pictureUrl,
        "genre": anime.genres?.map(genre => genre.name),
        "datePublished": anime.airingDate,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": anime.averageRating,
          "reviewCount": myAnimeListData ? myAnimeListData.myAnimeListUserCount : 0
        },
        "numberOfEpisodes": anime.episodes?.length || 0,
        "actor": anime.characters?.map(character => ({
          "@type": "Person",
          "name": character.name
        })),
        "inLanguage": "ar",
        "publisher": {
          "@type": "Organization",
          "name": "Anime Shadows",
          "alternateName": "أنمي شادوز"
        }
      }
    };
  }, [anime, myAnimeListData, slug]);

  useSEO(seoProps);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!anime) {
    return <Typography>No anime details found.</Typography>;
  }

  return (
    <HelmetProvider>
      <Container maxWidth="lg" className={styles.animeDetailsContainer}>
        <Suspense fallback={<LoadingSpinner />}>
          {isSmallScreen ? (
            <AnimeTabs
              anime={anime}
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
              handleRateAnime={handleRateAnime}
              handleGenreClick={handleGenreClick}
              openModal={openModal}
              getScoreDisplayProps={getScoreDisplayProps}
              t={t}
            />
          ) : (
            <div className={styles.animeDetailsGrid}>
              <AnimeSidebar
                anime={anime}
                isFavorite={isFavorite}
                handleFavoriteClick={handleFavoriteClick}
                handleRateAnime={handleRateAnime}
                t={t}
                className={styles.animeSidebar}
              />
              <div className={styles.animeMainContent}>
                <AnimeMainContent
                  anime={anime}
                  handleGenreClick={handleGenreClick}
                  getScoreDisplayProps={getScoreDisplayProps}
                  t={t}
                />
                <AnimeEpisodes
                  anime={anime}
                  openModal={openModal}
                  t={t}
                  viewingHistory={viewingHistory}
                />
              </div>
            </div>
          )}
          <RatingDialog
            ratingDialogOpen={ratingDialogOpen}
            setRatingDialogOpen={setRatingDialogOpen}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            submitRating={submitRating}
            removeRating={removeRating}
            userRating={userRating}
            t={t}
          />
        </Suspense>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </HelmetProvider>
  );
};

export default AnimeDetails;