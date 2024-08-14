import React, { useEffect, useState, useCallback, Suspense, lazy, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeBySlug, rateAnime, getMyAnimeList } from '../api/modules/anime';
import { addFavorite, removeFavorite } from '../api/modules/user';
import { Container, Typography, useMediaQuery, Snackbar, Alert } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { HelmetProvider } from 'react-helmet-async';
import useFetchUserData from '../hooks/useFetchUserData';
import { useSEO } from '../hooks/useSEO';
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
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [viewingHistory, setViewingHistory] = useState([]);
  const [myAnimeListData, setMyAnimeListData] = useState(null);
  const [myAnimeListLoading, setMyAnimeListLoading] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const { userData } = useFetchUserData();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getAnimeDetails = useCallback(async () => {
    console.log('Fetching anime details for slug:', slug);
    try {
      setLoading(true);
      const response = await fetchAnimeBySlug(slug);
      console.log('Anime details response:', response);
      if (!response) {
        throw new Error('No anime details found');
      }
      setAnime(response);
      const favoriteStatus = localStorage.getItem(`favorite-${response._id}`);
      setIsFavorite(favoriteStatus === 'true' || response.isFavorite || false);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && response.userRatings) {
        const userRating = response.userRatings.find(r => r.userId === user._id);
        if (userRating) {
          setUserRating(userRating.rating);
        }
      }
      getMyAnimeListData(response._id);
      getViewingHistory(response._id);
    } catch (error) {
      console.error('Error fetching anime details:', error);
      setError('Error fetching anime details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const getMyAnimeListData = useCallback(async (animeId) => {
    console.log('Fetching MyAnimeList data for anime ID:', animeId);
    try {
      setMyAnimeListLoading(true);
      const response = await getMyAnimeList(animeId);
      console.log('MyAnimeList data response:', response);
      setMyAnimeListData(response);
    } catch (error) {
      console.error('Error fetching MyAnimeList data:', error);
      setError('Error fetching MyAnimeList data');
    } finally {
      setMyAnimeListLoading(false);
    }
  }, []);

  const getViewingHistory = useCallback(async (animeId) => {
    console.log('Fetching viewing history for anime ID:', animeId);
    try {
      if (userData && userData.history) {
        const filteredHistory = userData.history.filter(item => item.anime === animeId);
        setViewingHistory(filteredHistory);
      }
    } catch (error) {
      console.error('Error fetching viewing history:', error);
    }
  }, [userData]);

  useEffect(() => {
    getAnimeDetails();
  }, [getAnimeDetails]);

  useEffect(() => {
    localStorage.setItem(`favorite-${slug}`, isFavorite);
  }, [isFavorite, slug]);

  const handleFavoriteClick = useCallback(async () => {
    console.log('Toggling favorite status for anime:', anime);
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
    console.log('Opening modal for episode:', episode);
    navigate(`/episode/${slug}-الحلقة-${episode.number}`);
  }, [navigate, slug]);

  const handleGenreClick = useCallback((genreId) => {
    console.log('Navigating to genre:', genreId);
    navigate(`/filter/genre/${genreId}`);
  }, [navigate]);

  const handleRateAnime = useCallback(() => {
    console.log('Opening rating dialog');
    setRatingDialogOpen(true);
  }, []);

  const submitRating = useCallback(async () => {
    console.log('Submitting rating:', selectedRating);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to rate');
        setSnackbarOpen(true);
        return;
      }
      await rateAnime(anime._id, user._id, selectedRating);
      setUserRating(selectedRating);
      const updatedAnime = await fetchAnimeBySlug(slug);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error rating anime:', error);
    }
  }, [slug, selectedRating, anime]);

  const removeRating = useCallback(async () => {
    console.log('Removing rating');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to remove rating');
        setSnackbarOpen(true);
        return;
      }
      await rateAnime(anime._id, user._id, null);
      setUserRating(null);
      const updatedAnime = await fetchAnimeBySlug(slug);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error removing rating:', error);
    }
  }, [slug, anime]);

  const getScoreDisplayProps = useCallback(() => ({
    score: myAnimeListData ? myAnimeListData.myAnimeListRating : 0,
    userCount: myAnimeListData ? myAnimeListData.myAnimeListUserCount : 0
  }), [myAnimeListData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const seoProps = useMemo(() => {
    if (!anime) return { title: slug };
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