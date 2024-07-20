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

const handleFileUpload = (file, title) => {
  const newFileName = `${title.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
  const newFilePath = path.join(uploadDir, newFileName);
  fs.renameSync(file.path, newFilePath);
  return `/uploads/${newFileName}`;
};


const validateEntityById = async (Model, id, entityName, file) => {
  const entity = await Model.findById(id.trim());
  if (!entity) {
    if (file) handleFileDeletion(file.path);
    throw new Error(`${entityName} not found`);
  }
  return entity;
};

const createAnime = async ({ title, description, seasonId, myAnimeListUrl, typeId, genres, numberOfEpisodes, source, duration, status, airingDate, file }) => {
  if (!typeId || !seasonId) {
    throw new Error('Type ID and Season ID are required');
  }

  // Parse genres if it's a string
  let genreIds = genres;
  if (typeof genres === 'string') {
    try {
      genreIds = JSON.parse(genres);
    } catch (error) {
      throw new Error('Invalid genres format');
    }
  }

  if (!Array.isArray(genreIds)) {
    throw new Error('genreIds must be an array');
  }

  await validateEntityById(Type, typeId, 'Type', file);
  await validateEntityById(Season, seasonId, 'Season', file);

  // Validate genre IDs
  const validGenreIds = [];
  for (const genreId of genreIds) {
    try {
      const genre = await validateEntityById(Genre, genreId, 'Genre', file);
      validGenreIds.push(genre._id);
    } catch (error) {
      console.error(`Invalid genre ID: ${genreId}`, error);
    }
  }

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
    genres: validGenreIds,
    numberOfEpisodes,
    source,
    duration,
    status,
    airingDate,
    pictureUrl: undefined
  });

  await newAnime.save();

  if (file) {
    newAnime.pictureUrl = handleFileUpload(file, title);
    await newAnime.save();
  }

  return newAnime;
};

const updateAnime = async (id, updateData, file) => {
  console.log('Updating anime with ID:', id);
  console.log('Update data:', updateData);

  if (updateData.type) {
    const typeDoc = await Type.findById(updateData.type);
    if (!typeDoc) {
      throw new Error('Invalid type ID');
    }
  }

  if (updateData.seasonId) {
    const seasonDoc = await Season.findById(updateData.seasonId);
    if (!seasonDoc) {
      throw new Error('Invalid season ID');
    }
  }

  if (updateData.genres) {
    const genreDocs = await Genre.find({ _id: { $in: updateData.genres } });
    if (genreDocs.length !== updateData.genres.length) {
      throw new Error('Invalid genre IDs');
    }
  }

  if (updateData.status && !['ongoing', 'completed', 'upcoming'].includes(updateData.status)) {
    throw new Error('Valid status is required');
  }

  const anime = await Anime.findById(id);
  if (!anime) {
    throw new Error('Anime not found');
  }

  if (file) {
    if (anime.pictureUrl) {
      handleFileDeletion(path.join(uploadDir, path.basename(anime.pictureUrl)));
    }
    updateData.pictureUrl = handleFileUpload(file, anime.title);
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
    user.viewingHistory.splice(watchedIndex, 1);
    message = 'Episode unmarked as watched';
  } else {
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

  const episode = { number, title, servers };
  anime.episodes.push(episode);
  await anime.save();
  return anime;
};

const getAnimes = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  let filter = {};

  if (query) {
    filter.title = { $regex: query, $options: 'i' };
  }

  if (tags.length > 0) {
    const genres = await Genre.find({ name: { $in: tags } }).select('_id');
    const genreIds = genres.map(genre => genre._id);
    filter.genres = broadMatches ? { $in: genreIds } : { $all: genreIds };
  }

  if (type) {
    const typeDoc = await Type.findOne({ name: type }).select('_id');
    if (typeDoc) {
      filter.type = typeDoc._id;
    } else {
      throw new Error('Invalid type ID');
    }
  }

  if (season) {
    const seasonDoc = await Season.findOne({ name: season }).select('_id');
    if (seasonDoc) {
      filter.season = seasonDoc._id;
    } else {
      throw new Error('Invalid season ID');
    }
  }

  if (state) {
    filter.status = state.toLowerCase();
  }

  let sortOption = {};
  if (sort) {
    if (sort === 'title') {
      sortOption.title = 1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    } else if (sort === 'releaseDate') {
      sortOption.releaseDate = -1;
    }
  }

  if (popular) {
    const now = new Date();
    let startDate;

    switch (popular) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    filter.views = { $gte: startDate };
  }

  const totalAnimes = await Anime.countDocuments(filter);
  const animes = await Anime.find(filter)
    .populate('season')
    .populate('type')
    .populate('genres')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  return {
    animes,
    totalPages: Math.ceil(totalAnimes / limit),
    currentPage: page
  };
};

const getAnime = async (animeId, userId) => {
  try {
    const anime = await Anime.findById(animeId)
      .populate('season')
      .populate('type')
      .populate('genres')
      .populate({
        path: 'episodes',
        options: {
          sort: { number: 1 },
        }
      });

    let isFavorite = false;
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.favorites.includes(animeId)) {
        isFavorite = true;
      }
    }

    if (anime) {
      anime.viewCount += 1;
      anime.views.push(new Date());
      await anime.save();
      return { ...anime.toObject(), isFavorite };
    } else {
      throw new Error('Anime not found');
    }
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
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
  if (!user) {
    throw new Error('Please Login');
  }

  const anime = await Anime.findById(animeId);
  if (!anime) {
    throw new Error('Anime not found');
  }

  const existingRating = anime.ratings.find(r => r.userId.toString() === userId.toString());

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    anime.ratings.push({ userId, rating });
  }

  await anime.save();
  const averageRating = anime.calculateAverageRating();
  const ratingUsers = anime.ratings.length;
  return { status: 200, data: { message: 'Rating updated', rating: averageRating, ratingUsers } };
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

  // Delete all episodes related to this anime
  await Episode.deleteMany({ animeId: id });

  // Remove the anime from all users' history and favorites
  await User.updateMany(
    { $or: [{ 'history.anime': id }, { favorites: id }] },
    { $pull: { history: { anime: id }, favorites: id } }
  );

  // Delete the anime
  await Anime.findByIdAndDelete(id);

  return { message: 'Anime and related episodes deleted successfully' };
};

const getRecommendations = async (animeId) => {
  // Implement recommendation logic here
};

const getAnimeByGenre = async (genre) => {
  return await Anime.find({ genres: genre });
};

const searchAnime = async (query) => {
  console.log('Searching for animes with query:', query);
  try {
    const searchRegex = new RegExp(query, 'i');
    const animes = await Anime.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { type: searchRegex },
        { season: searchRegex },
        { genres: searchRegex },
      ]
    });
    return animes;
  } catch (err) {
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
  const animes = await Anime.find(query).populate('season').populate('type').populate('genres');
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

    // Check if the anime is already in the user's history
    const historyItem = user.history.find(item => item.anime && item.anime.toString() === animeId);
    if (historyItem) {
      // Update the view date
      historyItem.views.push(new Date());
    } else {
      // Add new history item
      const anime = await Anime.findById(animeId);
      user.history.push({ anime: animeId, views: [new Date()], pictureUrl: anime.pictureUrl, title: anime.title });
    }

    await User.findByIdAndUpdate(userId, { history: user.history }, { new: true, upsert: true });
    return { message: 'Anime saved to history' };
  } catch (error) {
    console.error('Error saving anime to history:', error); // Log the error
    throw new Error('Server error: ' + error.message);
  }
};

const getFilteredAnimes = async (tags, broadMatches) => {
  try {
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

const getMovies = async (page = 1, limit = 10) => {
  try {
    console.log(`Fetching movies for page: ${page}, limit: ${limit}`);

    const movieType = await Type.findOne({ name: 'Movie' }).select('_id');
    if (!movieType) {
      throw new Error('Movie type not found');
    }

    const movieTypeId = movieType._id; // Extract the _id from the movieType object
    console.log(`Movie type ID: ${movieTypeId}`);

    const skip = (page - 1) * limit;
    console.log(`Skip: ${skip}, Limit: ${limit}`);

    const movies = await Anime.find({ type: movieTypeId })
        .populate('type')
        .skip(skip)
        .limit(limit);
    console.log(`Fetched movies: ${movies.length}`);

    const totalMovies = await Anime.countDocuments({ type: movieTypeId });
    console.log(`Total movies: ${totalMovies}`);

    return { animes: movies, totalPages: Math.ceil(totalMovies / limit) };
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    throw new Error('Error fetching movies: ' + error.message);
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
  getFilteredAnimes,
  getMovies
};