const Anime = require('../models/anime');
const Type = require('../models/type');
const Genre = require('../models/genre');
const Season = require('../models/season');
const User = require('../models/user');
const { filterViewsByTimeFrame } = require('../utils/viewUtils');
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

  let genreIds = Array.isArray(genres) ? genres : JSON.parse(genres);

  await validateEntityById(Type, typeId, 'Type', file);
  await validateEntityById(Season, seasonId, 'Season', file);

  const validGenreIds = [];
  for (const genreId of genreIds) {
    try {
      const genre = await validateEntityById(Genre, genreId, 'Genre', file);
      validGenreIds.push(genre._id);
    } catch (error) {
      console.error(`Invalid genre ID: ${genreId}`, error);
    }
  }

  const newAnime = new Anime({
    title,
    description,
    season: seasonId.trim(),
    myAnimeListUrl,
    type: typeId.trim(),
    genres: validGenreIds,
    numberOfEpisodes,
    source,
    duration,
    status,
    airingDate,
    pictureUrl: file ? handleFileUpload(file, title) : undefined
  });

  await newAnime.save();
  return newAnime;
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
    if (anime.pictureUrl) handleFileDeletion(path.join(uploadDir, path.basename(anime.pictureUrl)));
    updateData.pictureUrl = handleFileUpload(file, anime.title);
  }

  const updatedAnime = await Anime.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  if (!updatedAnime) throw new Error('Anime not found');

  return updatedAnime;
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
    user.viewingHistory.splice(watchedIndex, 1);
  } else {
    user.viewingHistory.push({ animeId, episodeNumber });
  }

  await user.save();
  return { message: watchedIndex !== -1 ? 'Episode unmarked as watched' : 'Episode marked as watched', viewingHistory: user.viewingHistory };
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

  const sortOption = {};
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
    .limit(limit);

  return {
    animes,
    totalPages: Math.ceil(totalAnimes / limit),
    currentPage: page
  };
};

const getAnime = async (animeId, userId) => {
  const anime = await Anime.findById(animeId)
    .populate('season')
    .populate('type')
    .populate('genres')
    .populate({
      path: 'episodes',
      options: { sort: { number: 1 } }
    });

  if (!anime) throw new Error('Anime not found');

  anime.viewCount += 1;
  anime.views.push(new Date());
  await anime.save();

  const isFavorite = userId ? (await User.findById(userId)).favorites.includes(animeId) : false;
  const averageRating = anime.calculateAverageRating();
  const userCount = anime.getUserCount();

  const myAnimeListData = anime.myAnimeListUrl ? await anime.fetchMyAnimeListData() : null;


  return { 
    ...anime.toObject(), 
    isFavorite, 
    averageRating, 
    userCount,
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

  await Episode.deleteMany({ animeId: id });
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
    .limit(limit);

  const totalMovies = await Anime.countDocuments({ type: movieTypeId });

  return { animes: movies, totalPages: Math.ceil(totalMovies / limit) };
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
  deleteAnime,
  getPopularAnimes,
  getPopularEpisodes,
  addToHistory,
  getFilteredAnimes,
  getMovies
};