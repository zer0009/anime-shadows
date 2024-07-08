const Anime = require('../models/anime');
const Type = require('../models/type');
const Genre = require('../models/genre');
const Season = require('../models/season');
const User = require('../models/user');
const { fetchMyAnimeListRating } = require('../utils/myAnimeList');
const fs = require('fs');
const path = require('path');

const uploadDir = 'uploads';

const handleFileDeletion = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const createAnime = async ({ title, description, seasonId, myAnimeListUrl, typeId, genres, numberOfEpisodes, source, duration, status, file }) => {
  if (!typeId || !seasonId) {
    throw new Error('Type ID and Season ID are required');
  }

  // if (!source) {
  //   throw new Error('Source is required');
  // }

  // if (!duration) {
  //   throw new Error('Duration is required');
  // }

  // if (!status || !['ongoing', 'completed', 'upcoming'].includes(status)) {
  //   throw new Error('Valid status is required');
  // }

  const type = await Type.findById(typeId.trim());
  if (!type) {
    if (file) handleFileDeletion(file.path);
    throw new Error('Type not found');
  }

  const season = await Season.findById(seasonId.trim());
  if (!season) {
    if (file) handleFileDeletion(file.path);
    throw new Error('Season not found');
  }

  const genreIds = await Promise.all(genres.map(async (genreName) => {
    let genre = await Genre.findOne({ name: genreName.trim() });
    if (!genre) {
      genre = new Genre({ name: genreName.trim() });
      await genre.save();
    }
    return genre._id;
  }));

  let myAnimeListRating = null;
  if (myAnimeListUrl) {
    myAnimeListRating = await fetchMyAnimeListRating(myAnimeListUrl);
  }

  const newAnime = new Anime({
    title,
    description,
    season: seasonId.trim(),
    myAnimeListRating,
    type: typeId.trim(),
    genres: genreIds,
    numberOfEpisodes,
    source,
    duration,
    status,
    pictureUrl: undefined
  });

  await newAnime.save();

  if (file) {
    const newFileName = `${title.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
    const newFilePath = path.join(uploadDir, newFileName);
    fs.renameSync(file.path, newFilePath);
    newAnime.pictureUrl = `/uploads/${newFileName}`;
    await newAnime.save();
  }

  return newAnime;
};

const updateAnime = async (id, updateData, file) => {
  if (updateData.typeId) {
    const type = await Type.findById(updateData.typeId.trim());
    if (!type) {
      throw new Error('Type not found');
    }
  }

  if (updateData.seasonId) {
    const season = await Season.findById(updateData.seasonId.trim());
    if (!season) {
      throw new Error('Season not found');
    }
  }

  if (updateData.genres) {
    const genreIds = await Promise.all(updateData.genres.map(async (genreName) => {
      let genre = await Genre.findOne({ name: genreName.trim() });
      if (!genre) {
        genre = new Genre({ name: genreName.trim() });
        await genre.save();
      }
      return genre._id;
    }));
    updateData.genres = genreIds;
  }

  if (updateData.status && !['ongoing', 'completed', 'upcoming'].includes(updateData.status)) {
    throw new Error('Valid status is required');
  }

  const anime = await Anime.findById(id);
  if (!anime) {
    throw new Error('Anime not found');
  }

  if (file) {
    // Delete the old image if it exists
    if (anime.pictureUrl) {
      const oldFilePath = path.join(uploadDir, path.basename(anime.pictureUrl));
      handleFileDeletion(oldFilePath);
    }

    // Save the new image
    const newFileName = `${anime.title.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
    const newFilePath = path.join(uploadDir, newFileName);
    fs.renameSync(file.path, newFilePath);
    updateData.pictureUrl = `/uploads/${newFileName}`;
  }

  const updatedAnime = await Anime.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  if (!updatedAnime) {
    throw new Error('Anime not found');
  }

  return updatedAnime;
};

const toggleEpisodeWatched = async (userId, animeId, episodeNumber) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const anime = await Anime.findById(animeId);
  if (!anime) {
    throw new Error('Anime not found');
  }

  if (!user.viewingHistory) {
    user.viewingHistory = [];
  }

  const watchedIndex = user.viewingHistory.findIndex(
    history => history.animeId.toString() === animeId && history.episodeNumber === episodeNumber
  );

  let message;
  if (watchedIndex !== -1) {
    // Episode is already marked as watched, so unmark it
    user.viewingHistory.splice(watchedIndex, 1);
    message = 'Episode unmarked as watched';
  } else {
    // Episode is not marked as watched, so mark it
    user.viewingHistory.push({ animeId, episodeNumber });
    message = 'Episode marked as watched';
  }

  await user.save();
  return { message, viewingHistory: user.viewingHistory };
};

const addEpisode = async (animeId, { number, title, servers }) => {
  const anime = await Anime.findById(animeId);
  if (!anime) {
    throw new Error('Anime not found');
  }

  const episode = {
    number,
    title,
    servers
  };

  anime.episodes.push(episode);
  await anime.save();
  return anime;
};

const getAnimes = async () => {
  return await Anime.find().populate('season').populate('type').populate('genres');
};

const getAnime = async (id) => {
  const anime = await Anime.findById(id).populate('season').populate('type').populate('genres');
  if (anime) {
    anime.viewCount += 1;
    anime.views.push(new Date());
    await anime.save();
    return anime;
  } else {
    throw new Error('Anime not found');
  }
};

const getEpisode = async (animeId, episodeId) => {
  const anime = await Anime.findById(animeId);
  if (anime) {
    const episode = anime.episodes.id(episodeId);
    if (episode) {
      episode.viewCount += 1;
      episode.views.push(new Date());
      await anime.save();
      return episode;
    } else {
      throw new Error('Episode not found');
    }
  } else {
    throw new Error('Anime not found');
  }
};

const rateAnime = async (animeId, userId, rating) => {
  const user = await User.findById(userId);
  if (!user || !userId) {
    throw new Error('Please Login');
  }

  const anime = await Anime.findById(animeId);
  if (!anime) {
    throw new Error('Anime not found');
  }

  const existingRating = anime.ratings.find(r => r.userId.toString() === userId.toString());

  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
  } else {
    // Add new rating
    anime.ratings.push({ userId, rating });
  }

  await anime.save();
  return {status: 200, data: {message: 'Rating updated', rating: anime.calculateAverageRating()}};
};

const addFavorite = async (userId, animeId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.favorites.includes(animeId)) {
    user.favorites.push(animeId);
    await user.save();
  }

  return { status: 200, data: { message: 'Anime added to favorites' } };
};

const removeFavorite = async (userId, animeId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const index = user.favorites.indexOf(animeId);
  if (index > -1) {
    user.favorites.splice(index, 1);
    await user.save();
  }

  return { status: 200, data: { message: 'Anime removed from favorites' } };
};

const deleteAnime = async (id) => {
  const anime = await Anime.findById(id);
  if (!anime) {
    throw new Error('Anime not found');
  }

  await anime.remove();
  return { message: 'Anime deleted successfully' };
};

const getRecommendations = async (animeId) => {
  // Implement recommendation logic here
};

const getAnimeByGenre = async (genre) => {
  return await Anime.find({ genres: genre });
};

const searchAnime = async (query) => {
  console.log('Searching for animes with query:', query); // Log the query
  try {
    // Use a regular expression to perform a case-insensitive search
    const searchRegex = new RegExp(query, 'i');
    const animes = await Anime.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        // Add other fields you want to search by
      ]
    });
    console.log('Found animes:', animes); // Log the found animes
    return animes;
  } catch (err) {
    console.log('Error in searchAnime service:', err.message);
    throw new Error('Error searching for animes: ' + err.message);
  }
};

const getAnimeViewCount = async (animeId) => {
  const anime = await Anime.findById(animeId);
  if (anime) {
    anime.viewCount += 1;
    anime.views.push(new Date());
    await anime.save();
    return { message: 'Anime viewed', viewCount: anime.viewCount };
  } else {
    return { message: 'Anime not found' };
  }
};

const filterViewsByTimeFrame = (views, timeFrame) => {
  const now = new Date();
  let startDate;

  switch (timeFrame) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'all':
    default:
      return views.length;
  }

  return views.filter(view => view >= startDate).length;
};

const getPopularAnimes = async (timeFrame, genre) => {
  const query = genre ? { genres: genre } : {};
  const animes = await Anime.find(query);
  const sortedAnimes = animes.map(anime => ({
    ...anime.toObject(),
    filteredViewCount: filterViewsByTimeFrame(anime.views, timeFrame)
  })).sort((a, b) => b.filteredViewCount - a.filteredViewCount);

  return sortedAnimes;
};

const getPopularEpisodes = async (timeFrame, genre) => {
  const query = genre ? { genres: genre } : {};
  const animes = await Anime.find(query);
  let episodes = [];
  animes.forEach(anime => {
    episodes = episodes.concat(anime.episodes.map(episode => ({
      ...episode.toObject(),
      filteredViewCount: filterViewsByTimeFrame(episode.views, timeFrame)
    })));
  });

  const sortedEpisodes = episodes.sort((a, b) => b.filteredViewCount - a.filteredViewCount);

  return sortedEpisodes;
};

const addToHistory = async (userId, animeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the anime is already in the history
    const isInHistory = user.history.some(historyItem => historyItem.toString() === animeId);
    if (!isInHistory) {
      user.history.push(animeId);
      await user.save();
    }
  } catch (err) {
    throw new Error('Failed to add anime to history');
  }
};


const getFilteredAnimes = async (tags, broadMatches) => {
  try {
      console.log('Filtering animes with tags:', tags);
      console.log('Broad matches:', broadMatches);

              // Convert tag names to ObjectIds
      const tagObjectIds = await Genre.find({ name: { $in: tags } }).select('_id');
      const tagIds = tagObjectIds.map(tag => tag._id);

      const query = broadMatches
      ? { genres: { $in: tagIds } }
      : { genres: { $all: tagIds } };

      return await Anime.find(query).populate('season').populate('type').populate('genres');
  } catch (error) {
      console.error('Error in getFilteredAnimes:', error);
      throw error;
  }
};



module.exports = {
  createAnime,
  updateAnime,
  addEpisode,
  toggleEpisodeWatched,
  getAnimes,
  getAnime,
  getEpisode,
  rateAnime,
  addFavorite,
  removeFavorite,
  deleteAnime,
  getRecommendations,
  getAnimeByGenre,
  searchAnime,
  handleFileDeletion,
  getAnimeViewCount,
  getPopularAnimes,
  getPopularEpisodes,
  addToHistory,
  getFilteredAnimes
};

