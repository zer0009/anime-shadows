import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAnimeById, rateAnime, getMyAnimeList } from '../api/modules/anime';
import { addFavorite, removeFavorite } from '../api/modules/user';
import { Container, Typography, useMediaQuery, Snackbar, Alert } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import useFetchUserData from '../hooks/useFetchUserData';
import styles from './AnimeDetails.module.css';

const AnimeSidebar = lazy(() => import('../components/AnimeDetails/AnimeSidebar.jsx'));
const AnimeMainContent = lazy(() => import('../components/AnimeDetails/AnimeMainContent.jsx'));
const RatingDialog = lazy(() => import('../components/AnimeDetails/RatingDialog.jsx'));
const AnimeTabs = lazy(() => import('../components/AnimeDetails/AnimeTabs.jsx'));
const AnimeEpisodes = lazy(() => import('../components/AnimeDetails/AnimeEpisodes.jsx'));

const AnimeDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
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
    try {
      setLoading(true);
      const response = await fetchAnimeById(id);
      setAnime(response);
      const favoriteStatus = localStorage.getItem(`favorite-${id}`);
      setIsFavorite(favoriteStatus === 'true' || response.isFavorite || false);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && response.userRatings) {
        const userRating = response.userRatings.find(r => r.userId === user._id);
        if (userRating) {
          setUserRating(userRating.rating);
        }
      }
    } catch (error) {
      console.error('Error fetching anime details:', error);
      setError('Error fetching anime details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getMyAnimeListData = useCallback(async () => {
    try {
      setMyAnimeListLoading(true);
      const response = await getMyAnimeList(id);
      setMyAnimeListData(response);
    } catch (error) {
      console.error('Error fetching MyAnimeList data:', error);
    } finally {
      setMyAnimeListLoading(false);
    }
  }, [id]);

  const getViewingHistory = useCallback(() => {
    try {
      if (userData && userData.history) {
        const filteredHistory = userData.history.filter(item => item.anime === id);
        setViewingHistory(filteredHistory);
      }
    } catch (error) {
      console.error('Error fetching viewing history:', error);
    }
  }, [userData, id]);

  useEffect(() => {
    getAnimeDetails();
    getViewingHistory();
    getMyAnimeListData();
  }, [getAnimeDetails, getViewingHistory, getMyAnimeListData]);

  useEffect(() => {
    localStorage.setItem(`favorite-${id}`, isFavorite);
  }, [isFavorite, id]);

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
    navigate(`/episode/${episode._id}`);
  }, [navigate]);

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
      await rateAnime(id, user._id, selectedRating);
      setUserRating(selectedRating);
      const updatedAnime = await fetchAnimeById(id);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error rating anime:', error);
    } finally {
      setRatingDialogOpen(false);
    }
  }, [id, selectedRating]);

  const removeRating = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setSnackbarMessage('Please login to remove rating');
        setSnackbarOpen(true);
        return;
      }
      await rateAnime(id, user._id, null);
      setUserRating(null);
      const updatedAnime = await fetchAnimeById(id);
      setAnime(updatedAnime);
    } catch (error) {
      console.error('Error removing rating:', error);
    }
  }, [id]);

  const getScoreDisplayProps = useMemo(() => (anime) => ({
    score: myAnimeListData ? myAnimeListData.myAnimeListRating : 0,
    userCount: myAnimeListData ? myAnimeListData.myAnimeListUserCount : 0
  }), [myAnimeListData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
        <Helmet>
          <title>{`${anime.title} - ${anime.subTitle} | أنمي شادوز - Anime Shadows`}</title>
          <meta name="description" content={`شاهد ${anime.title} - ${anime.subTitle} اون لاين على أنمي شادوز (Anime Shadows). ${anime.description.substring(0, 150)}...`} />
          <meta name="keywords" content={`${anime.title}, ${anime.subTitle}, ${anime.genres.map(genre => genre.name).join(', ')}, أنمي, مشاهدة اون لاين, Anime Shadows`} />
          <link rel="canonical" href={`https://animeshadows.xyz/anime/${anime._id}`} />
          <meta property="og:title" content={`${anime.title} - ${anime.subTitle} | أنمي شادوز - Anime Shadows`} />
          <meta property="og:description" content={`شاهد ${anime.title} اون لاين على أنمي شادوز (Anime Shadows). ${anime.description.substring(0, 150)}...`} />
          <meta property="og:image" content={anime.pictureUrl} />
          <meta property="og:url" content={`https://animeshadows.xyz/anime/${anime._id}`} />
          <meta property="og:type" content="video.tv_show" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${anime.title} - ${anime.subTitle} | أنمي شادوز - Anime Shadows`} />
          <meta name="twitter:description" content={`شاهد ${anime.title} اون لاين على أنمي شادوز (Anime Shadows). ${anime.description.substring(0, 150)}...`} />
          <meta name="twitter:image" content={anime.pictureUrl} />
          <meta name="robots" content="index, follow" />
        </Helmet>
        <JsonLd
          item={{
            "@context": "https://schema.org",
            "@type": "TVSeries",
            "name": anime.title,
            "alternateName": anime.subTitle,
            "description": anime.description,
            "image": anime.pictureUrl,
            "genre": anime.genres.map(genre => genre.name),
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
          }}
        />
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