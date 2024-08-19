import { markAsWatched, markAsUnwatched } from '../api/modules/anime';

export const handleMarkAsWatched = async (animeId, episodeId, setWatchedEpisodes, setWatchedCount, setSnackbarMessage, setSnackbarOpen) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    setSnackbarMessage('Please login to mark as watched');
    setSnackbarOpen(true);
    return;
  }

  try {
    await markAsWatched(animeId, episodeId);
    setWatchedEpisodes(prevWatched => ({
      ...prevWatched,
      [episodeId]: true
    }));
    setWatchedCount(prevCount => prevCount + 1);
  } catch (error) {
    console.error('Error marking episode as watched:', error);
  }
};

export const handleMarkAsUnwatched = async (animeId, episodeId, setWatchedEpisodes, setWatchedCount, setSnackbarMessage, setSnackbarOpen) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    setSnackbarMessage('Please login to mark as unwatched');
    setSnackbarOpen(true);
    return;
  }

  try {
    await markAsUnwatched(animeId, episodeId);
    setWatchedEpisodes(prevWatched => {
      const newWatched = { ...prevWatched };
      delete newWatched[episodeId];
      return newWatched;
    });
    setWatchedCount(prevCount => prevCount - 1);
  } catch (error) {
    console.error('Error marking episode as unwatched:', error);
  }
};