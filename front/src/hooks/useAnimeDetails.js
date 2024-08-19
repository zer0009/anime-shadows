import { useState, useEffect, useCallback } from 'react';
import { fetchAnimeBySlug, getMyAnimeList } from '../api/modules/anime';

const useAnimeDetails = (slug, userData) => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [viewingHistory, setViewingHistory] = useState([]);
  const [myAnimeListData, setMyAnimeListData] = useState(null);

  const getAnimeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAnimeBySlug(slug);
      if (!response) throw new Error('No anime details found');
      setAnime(response);
      setIsFavorite(localStorage.getItem(`favorite-${response._id}`) === 'true' || response.isFavorite || false);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && response.userRatings) {
        const userRating = response.userRatings.find(r => r.userId === user._id);
        if (userRating) setUserRating(userRating.rating);
      }
      getMyAnimeListData(response._id);
      getViewingHistory(response._id);
    } catch (error) {
      setError('Error fetching anime details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const getMyAnimeListData = useCallback(async (animeId) => {
    try {
      const response = await getMyAnimeList(animeId);
      setMyAnimeListData(response);
    } catch (error) {
      setError('Error fetching MyAnimeList data');
    }
  }, []);

  const getViewingHistory = useCallback(async (animeId) => {
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

  return {
    anime,
    loading,
    error,
    isFavorite,
    userRating,
    viewingHistory,
    myAnimeListData,
    setIsFavorite,
    setUserRating,
    setViewingHistory,
    setMyAnimeListData,
  };
};

export default useAnimeDetails;