const mongoose = require('mongoose');
const Anime = require('../models/anime');
const Type = require('../models/type');
const Genre = require('../models/genre');
const Season = require('../models/season');
const User = require('../models/user');
const Episode = require('../models/episode');
const { filterViewsByTimeFrame } = require('../utils/viewUtils');
const { deleteImage } = require('../middlewares/fileUpload');

const validateEntityById = async (Model, id, entityName, file) => {
  const entity = await Model.findById(id.trim());
  if (!entity) {
    if (file) handleFileDeletion(file.path);
    throw new Error(`${entityName} not found`);
  }
  return entity;
};

const createAnime = async (animeData) => {
  const anime = new Anime(animeData);
  await anime.save();
  return anime;
};

const updateAnime = async (id, updateData, file) => {
  const anime = await Anime.findById(id);
  if (!anime) throw new Error('Anime not found');

  if (updateData.type) await validateEntityById(Type, updateData.type, 'Type');
  if (updateData.season) await validateEntityById(Season, updateData.season, 'Season');
  if (updateData.genres) {
    const genreDocs = await Genre.find({ _id: { $in: updateData.genres } });
    if (genreDocs.length !== updateData.genres.length) throw new Error('Invalid genre IDs');
  }
  if (updateData.status && !['ongoing', 'completed', 'upcoming'].includes(updateData.status)) {
    throw new Error('Valid status is required');
  }

  if (file) {
    await deleteImage(anime.pictureUrl); // Delete the old image if a new one is uploaded
    updateData.pictureUrl = file.path;
  }

  Object.assign(anime, updateData);
  await anime.save();
  return anime;
};

const toggleEpisodeWatched = async (userId, animeId, episodeNumber) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  const watchedIndex = user.viewingHistory.findIndex(
    history => history.animeId.toString() === animeId && history.episodeNumber === episodeNumber
  );

  if (watchedIndex !== -1) {
    // Remove episode from viewing history
    user.viewingHistory.splice(watchedIndex, 1);
  } else {
    // Add episode to viewing history
    user.viewingHistory.push({ animeId, episodeNumber, viewedAt: new Date() });
  }

  await user.save();
  return { 
    message: watchedIndex !== -1 ? 'Episode unmarked as watched' : 'Episode marked as watched', 
    viewingHistory: user.viewingHistory 
  };
};

const addEpisode = async (animeId, { number, title, servers }) => {
  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  anime.episodes.push({ number, title, servers });
  await anime.save();
  return anime;
};

const getAnimes = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query) filter.title = { $regex: query, $options: 'i' };
  if (tags.length > 0) {
    const genres = await Genre.find({ name: { $in: tags } }).select('_id');
    const genreIds = genres.map(genre => genre._id);
    filter.genres = broadMatches ? { $in: genreIds } : { $all: genreIds };
  }
  if (type) {
    const typeDoc = await Type.findOne({ name: type }).select('_id');
    if (typeDoc) filter.type = typeDoc._id;
    else throw new Error('Invalid type ID');
  }
  if (season) {
    const seasonDoc = await Season.findOne({ name: season }).select('_id');
    if (seasonDoc) filter.season = seasonDoc._id;
    else throw new Error('Invalid season ID');
  }
  if (state) filter.status = state.toLowerCase();

  const sortOption = { createdAt: -1 };
  if (sort) {
    if (sort === 'title') sortOption.title = 1;
    else if (sort === 'rating') sortOption.rating = -1;
    else if (sort === 'releaseDate') sortOption.releaseDate = -1;
    else if (sort === 'recent') sortOption.createdAt = -1;
  }

  if (popular) {
    const now = new Date();
    let startDate;
    switch (popular) {
      case 'today': startDate = new Date(now.setHours(0, 0, 0, 0)); break;
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      default: startDate = new Date(0);
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
    .limit(limit)
    .lean();

  return {
    animes,
    totalPages: Math.ceil(totalAnimes / limit),
    currentPage: page
  };
};

const getAnime = async (animeId, userId) => {
  // Fetch anime details without views and viewCount fields
  const animeDetails = await Anime.findById(animeId)
    .select('-views -viewCount')
    .populate('season')
    .populate('type')
    .populate('genres')
    .populate({
      path: 'episodes',
      options: { sort: { number: 1 } },
      select: '-streamingServers -downloadServers' // Exclude streamingServers and downloadServers
    })
    .lean();

  if (!animeDetails) throw new Error('Anime not found');

  // Fetch anime details with views and viewCount fields for updating
  const anime = await Anime.findById(animeId);
  anime.viewCount += 1;
  anime.views.push(new Date());
  await anime.save();

  const isFavorite = userId ? (await User.findById(userId)).favorites.includes(animeId) : false;
  const averageRating = anime.calculateAverageRating();
  const userCount = anime.getUserCount();

  return { 
    ...animeDetails, 
    isFavorite, 
    averageRating, 
    userCount
  };
};

const getAnimeBySlug = async (slug, userId) => {
  console.log('Fetching anime details for slug:', slug); // Add logging
  try {
    // Fetch anime details without views and viewCount fields
    const animeDetails = await Anime.findOne({ slug })
      .select('-views -viewCount')
      .populate('season')
      .populate('type')
      .populate('genres')
      .populate({
        path: 'episodes',
        options: { sort: { number: 1 } },
        select: '-streamingServers -downloadServers' // Exclude streamingServers and downloadServers
      })
      .lean();
      console.log('animeDetails', animeDetails)

    if (!animeDetails) {
      console.error('Anime not found for slug:', slug); // Add logging
      throw new Error('Anime not found');
    }

    // Fetch anime details with views and viewCount fields for updating
    const anime = await Anime.findOne({ slug });
    anime.viewCount += 1;
    anime.views.push(new Date());
    await anime.save();
    animeDetails._id = anime._id.toString();

    const isFavorite = userId ? (await User.findById(userId)).favorites.includes(animeDetails._id) : false;
    const averageRating = anime.calculateAverageRating();
    const userCount = anime.getUserCount();

    return { 
      ...animeDetails, 
      isFavorite, 
      averageRating, 
      userCount
    };
  } catch (error) {
    console.error('Error in getAnimeBySlug:', error); // Add logging
    throw error;
  }
};

const getMyAnimeListData = async (animeId) => {
  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  const myAnimeListData = anime.myAnimeListUrl ? await anime.fetchMyAnimeListData() : null;

  return {
    myAnimeListRating: myAnimeListData ? myAnimeListData.rating : null,
    myAnimeListUserCount: myAnimeListData ? myAnimeListData.userCount : null
  };
};

const getEpisode = async (animeId, episodeId) => {
  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  const episode = anime.episodes.id(episodeId);
  if (!episode) throw new Error('Episode not found');

  episode.viewCount += 1;
  episode.views.push(new Date());
  await anime.save();
  return episode;
};

const rateAnime = async (animeId, userId, rating) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Please Login');

  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  const existingRating = anime.ratings.find(r => r.userId.toString() === userId.toString());

  if (rating === null) {
    if (existingRating) anime.ratings = anime.ratings.filter(r => r.userId.toString() !== userId.toString());
  } else {
    if (existingRating) existingRating.rating = rating;
    else anime.ratings.push({ userId, rating });
  }

  await anime.save();
  const averageRating = anime.calculateAverageRating();
  const ratingUsers = anime.getUserCount();
  return { status: 200, data: { message: 'Rating updated', rating: averageRating, ratingUsers } };
};

const deleteAnime = async (id) => {
  const anime = await Anime.findById(id);
  if (!anime) throw new Error('Anime not found');

  const episodes = await Episode.find({ animeId: id });
  if (episodes.length > 0) {
    await Episode.deleteMany({ animeId: id });
  }

  await User.updateMany(
    { $or: [{ 'history.anime': id }, { favorites: id }] },
    { $pull: { history: { anime: id }, favorites: id } }
  );
  await Anime.findByIdAndDelete(id);

  return { message: 'Anime and related episodes deleted successfully' };
};

const getPopularAnimes = async (timeFrame, genre, page = 1, limit = 10) => {
  const query = genre ? { genres: genre } : {};
  const skip = (page - 1) * limit;

  const animes = await Anime.find(query)
    .populate('season')
    .populate('type')
    .populate('genres')
    .skip(skip)
    .limit(limit);

  const totalDocs = await Anime.countDocuments(query);

  const sortedAnimes = animes.map(anime => ({
    ...anime.toObject(),
    filteredViewCount: filterViewsByTimeFrame(anime.views, timeFrame)
  })).sort((a, b) => b.filteredViewCount - a.filteredViewCount);

  return {
    sortedAnimes,
    total: totalDocs,
    pages: Math.ceil(totalDocs / limit),
    page,
    limit
  };
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

  return episodes.sort((a, b) => b.filteredViewCount - a.filteredViewCount);
};

const addToHistory = async (userId, animeId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const historyItem = user.history.find(item => item.anime && item.anime.toString() === animeId);
  if (historyItem) {
    historyItem.views.push(new Date());
  } else {
    const anime = await Anime.findById(animeId);
    user.history.push({ anime: animeId, views: [new Date()], pictureUrl: anime.pictureUrl, title: anime.title });
  }

  await User.findByIdAndUpdate(userId, { history: user.history }, { new: true, upsert: true });
  return { message: 'Anime saved to history' };
};

const getFilteredAnimes = async (tags, broadMatches) => {
  const tagObjectIds = await Genre.find({ name: { $in: tags } }).select('_id');
  const tagIds = tagObjectIds.map(tag => tag._id);

  const query = broadMatches
    ? { genres: { $in: tagIds } }
    : { genres: { $all: tagIds } };

  return await Anime.find(query).populate('season').populate('type').populate('genres');
};

const getMovies = async (page = 1, limit = 10) => {
  const movieType = await Type.findOne({ name: 'Movie' }).select('_id');
  if (!movieType) throw new Error('Movie type not found');

  const movieTypeId = movieType._id;
  const skip = (page - 1) * limit;

  const movies = await Anime.find({ type: movieTypeId })
    .populate('type')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const totalMovies = await Anime.countDocuments({ type: movieTypeId });

  return { animes: movies, totalPages: Math.ceil(totalMovies / limit) };
};

const markAllEpisodesWatched = async (userId, animeId, watched = true) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  if (watched) {
    // Mark all episodes as watched
    anime.episodes.forEach(episode => {
      if (!user.viewingHistory.some(history => history.animeId.toString() === animeId && history.episodeNumber === episode.number)) {
        user.viewingHistory.push({ animeId, episodeNumber: episode.number, viewedAt: new Date() });
      }
    });
  } else {
    // Mark all episodes as unwatched
    user.viewingHistory = user.viewingHistory.filter(history => history.animeId.toString() !== animeId);
  }

  await user.save();
  return { message: watched ? 'All episodes marked as watched' : 'All episodes marked as unwatched', viewingHistory: user.viewingHistory };
};

const getWatchedEpisodes = async (userId, animeId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const watchedEpisodes = user.viewingHistory.filter(history => history.animeId.toString() === animeId);
  return watchedEpisodes;
};

const markEpisodeAsWatched = async (userId, animeId, episodeId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const anime = await Anime.findById(animeId);
  if (!anime) throw new Error('Anime not found');

  const episode = await Episode.findById(episodeId);
  if (!episode) throw new Error('Episode not found');

  const historyItem = user.viewingHistory.find(item => item.animeId.toString() === animeId && item.episodeId.toString() === episodeId);
  if (!historyItem) {
    user.viewingHistory.push({ animeId, episodeId, viewedAt: new Date() });
  } else {
    // If the episode is already in the history, update the viewedAt date
    historyItem.viewedAt = new Date();
  }

  await user.save();
  return { message: 'Episode marked as watched', viewingHistory: user.viewingHistory };
};

const markEpisodeAsUnwatched = async (userId, animeId, episodeId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.viewingHistory = user.viewingHistory.filter(item => !(item.animeId.toString() === animeId && item.episodeId.toString() === episodeId));

  await user.save();
  return { message: 'Episode marked as unwatched', viewingHistory: user.viewingHistory };
};

const getViewingHistory = async (userId, animeId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const viewingHistory = user.viewingHistory.filter(item => item.animeId.toString() === animeId);
  return viewingHistory;
};

const getAnimesByIds = async (ids) => {
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id)); // Use 'new' keyword
  const animes = await Anime.find({ _id: { $in: objectIds } }).lean();
  return animes;
};

module.exports = {
  createAnime,
  updateAnime,
  addEpisode,
  toggleEpisodeWatched,
  getAnimes,
  getAnime,
  getAnimeBySlug,
  getMyAnimeListData,
  getEpisode,
  rateAnime,
  deleteAnime,
  getPopularAnimes,
  getPopularEpisodes,
  addToHistory,
  getFilteredAnimes,
  getMovies,
  markAllEpisodesWatched,
  getWatchedEpisodes,
  markEpisodeAsWatched,
  markEpisodeAsUnwatched,
  getViewingHistory,
  getAnimesByIds
};