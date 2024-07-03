const { body, validationResult } = require('express-validator');
const AnimeService = require('../services/animeService');
const User = require('../models/user');
const Anime = require('../models/anime');

exports.uploadAnime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) AnimeService.handleFileDeletion(req.file.path);
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, seasonId, myAnimeListUrl, typeId, genres, numberOfEpisodes, source, duration, status } = req.body;
  const file = req.file;

  // Ensure genres is an array of strings
  let genresArray;
  try {
    genresArray = JSON.parse(genres);
    if (!Array.isArray(genresArray) || !genresArray.every(genre => typeof genre === 'string')) {
      throw new Error('Genres must be an array of strings');
    }
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: 'Genres must be an array of strings', param: 'genres', location: 'body' }] });
  }

  try {
    const newAnime = await AnimeService.createAnime({
      title,
      description,
      seasonId,
      myAnimeListUrl,
      typeId,
      genres: genresArray,
      numberOfEpisodes,
      source,
      duration,
      status,
      file
    });

    res.status(201).json(newAnime);
  } catch (err) {
    if (file) AnimeService.handleFileDeletion(file.path);
    res.status(400).json({ error: err.message });
  }
};

exports.updateAnime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updateData = req.body;
  const file = req.file;

  // Ensure genres is an array of strings if provided
  if (updateData.genres) {
    try {
      updateData.genres = JSON.parse(updateData.genres);
      if (!Array.isArray(updateData.genres) || !updateData.genres.every(genre => typeof genre === 'string')) {
        throw new Error('Genres must be an array of strings');
      }
    } catch (err) {
      return res.status(400).json({ errors: [{ msg: 'Genres must be an array of strings', param: 'genres', location: 'body' }] });
    }
  }

  try {
    const updatedAnime = await AnimeService.updateAnime(id, updateData, file);
    res.status(200).json(updatedAnime);
  } catch (err) {
    if (file) AnimeService.handleFileDeletion(file.path);
    res.status(400).json({ error: err.message });
  }
};

exports.toggleEpisodeWatched = async (req, res) => {
  const { animeId, episodeNumber } = req.body;

  try {
    const result = await AnimeService.toggleEpisodeWatched(req.user._id, animeId, episodeNumber);
    const statusCode = result.message.includes('unmarked') ? 200 : 201;
    res.status(statusCode).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addEpisode = async (req, res) => {
  const { animeId } = req.params;
  const { number, title, servers } = req.body;

  try {
    const updatedAnime = await AnimeService.addEpisode(animeId, { number, title, servers });
    res.status(200).json(updatedAnime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnimes = async (req, res) => {
  try {
    const animes = await AnimeService.getAnimes();
    res.json(animes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnime = async (req, res) => {
  const { id } = req.params;

  try {
    const anime = await AnimeService.getAnime(id);
    res.json(anime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEpisode = async (req, res) => {
  const { animeId, episodeId } = req.params;

  try {
    const episode = await AnimeService.getEpisode(animeId, episodeId);
    res.json(episode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rateAnime = async (req, res) => {
  const { rating } = req.body;
  const animeId = req.params.id;


  try {
    const updatedAnime = await AnimeService.rateAnime(animeId, req.user._id, rating);
    res.status(200).json(updatedAnime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  const { userId, animeId } = req.body;

  try {
    const result = await AnimeService.addFavorite(userId, animeId);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, animeId } = req.body;

  try {
    const result = await AnimeService.removeFavorite(userId, animeId);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnime = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AnimeService.deleteAnime(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { animeId } = req.params;

  try {
    const recommendations = await AnimeService.getRecommendations(animeId);
    res.json(recommendations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnimeByGenre = async (req, res) => {
  const { genre } = req.params;

  try {
    const animes = await AnimeService.getAnimeByGenre(genre);
    res.json(animes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.searchAnime = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const animes = await AnimeService.searchAnime(query);
    res.json(animes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnimeViewCount = async (req, res) => {
  const { id } = req.params;
  try {
    const viewCount = await AnimeService.getAnimeViewCount(id);
    res.json(viewCount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPopularAnimes = async (req, res) => {
  const { timeFrame, genre } = req.query;

  try {
    const popularAnimes = await AnimeService.getPopularAnimes(timeFrame, genre);
    res.json(popularAnimes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPopularEpisodes = async (req, res) => {
  const { timeFrame, genre } = req.query;

  try {
    const popularEpisodes = await AnimeService.getPopularEpisodes(timeFrame, genre);
    res.json(popularEpisodes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
