const { body, validationResult } = require('express-validator');
const AnimeService = require('../services/animeService');
const User = require('../models/user');
const Anime = require('../models/anime');
const Genre = require('../models/genre');
const mongoose = require('mongoose');
const { deleteImage } = require('../middlewares/fileUpload');
const { scrapeAnimeFromMAL } = require('../utils/myAnimeList');
const { scrapeAnimeFromLiveChart } = require('../utils/liveChartScraper');


const Type = require('../models/type');

exports.uploadAnime = async (req, res) => {
  try {
    const { 
      title, 
      subTitle, 
      description, 
      typeId, 
      seasonId,
      numberOfEpisodes, 
      status, 
      airingDate, 
      studio, 
      source, 
      genres, 
      duration, 
      pictureUrl,
      myAnimeListUrl
    } = req.body;

    let animeData = {
      title, 
      subTitle, 
      description, 
      typeId,
      seasonId,
      numberOfEpisodes, 
      status, 
      airingDate, 
      studio, 
      source, 
      genres, 
      duration, 
      pictureUrl,
      myAnimeListUrl
    };

    // Handle file upload if present
    if (req.file) {
      animeData.pictureUrl = req.file.path;
    }

    // Ensure pictureUrl is a string
    if (Array.isArray(animeData.pictureUrl)) {
      animeData.pictureUrl = animeData.pictureUrl[0];
    }

    // If no file was uploaded and no pictureUrl provided, use a default image
    if (!animeData.pictureUrl) {
      animeData.pictureUrl = 'path/to/default/image.jpg';
    }

    // Validate and process genres
    if (typeof animeData.genres === 'string') {
      animeData.genres = JSON.parse(animeData.genres);
    }
    if (!Array.isArray(animeData.genres)) {
      throw new Error('Genres must be an array');
    }

    // Validate typeId and seasonId
    if (!animeData.typeId || !animeData.seasonId) {
      throw new Error('Type ID and Season ID are required');
    }

    // Create the anime
    const newAnime = await AnimeService.createAnime(animeData);

    res.status(201).json(newAnime);
  } catch (error) {
    console.error('Error uploading anime:', error);
    if (req.file) deleteImage(req.file.path); // Delete the uploaded image if there is an error
    res.status(500).json({ error: error.message });
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
  try {
    if (updateData.genres) {
      const genresArray = JSON.parse(updateData.genres);
      if (!Array.isArray(genresArray) || !genresArray.every(genre => mongoose.Types.ObjectId.isValid(genre))) {
        throw new Error('Genres must be an array of valid ObjectId strings');
      }
      updateData.genres = genresArray.map(genre => new mongoose.Types.ObjectId(genre));
    }

    if (updateData.seasonId) {
      const seasonDoc = await Season.findById(updateData.seasonId).lean();
      if (!seasonDoc) {
        throw new Error('Invalid season ID');
      }
    }

    const updatedAnime = await AnimeService.updateAnime(id, updateData, file);
    res.status(200).json(updatedAnime);
  } catch (err) {
    if (file) deleteImage(file.path); // Delete the uploaded image if there is an error
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
  const { query = '', tags = '[]', type = '', season = '', sort = '', popular = '', state = '', broadMatches = false, page = 1, limit = 10 } = req.query;

  try {
    const parsedTags = JSON.parse(tags);
    const result = await AnimeService.getAnimes(query, parsedTags, type, season, sort, popular, state, broadMatches === 'true', parseInt(page), parseInt(limit));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnime = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const anime = user ? await AnimeService.getAnime(id, user._id) : await AnimeService.getAnime(id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    if (req.user) {
      await AnimeService.addToHistory(req.user._id, id);
    }

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
  const { q, tags, broadMatches } = req.query;
  let query = {};

  if (q) {
    query.title = { $regex: q, $options: 'i' };
  }

  if (tags) {
    const tagsArray = tags.split(',');
    const tagObjectIds = await Genre.find({ name: { $in: tagsArray } }).select('_id').lean();
    const tagIds = tagObjectIds.map(tag => tag._id);

    const filterQuery = broadMatches === 'true'
      ? { genres: { $in: tagIds } }
      : { genres: { $all: tagIds } };

    query = { ...query, ...filterQuery };
  }

  try {
    const animes = await Anime.find(query).populate('season').populate('type').populate('genres').lean();
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const { timeFrame, genre, page = 1, limit = 10 } = req.query;

  try {
    const popularAnimes = await AnimeService.getPopularAnimes(timeFrame, genre, parseInt(page), parseInt(limit));
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

exports.filterAnimes = async (req, res) => {
  const { tags, broadMatches } = req.query;

  try {
    const tagsArray = tags.split(',');
    const animes = await AnimeService.getFilteredAnimes(tagsArray, broadMatches === 'true');
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const movies = await AnimeService.getMovies(parseInt(page), parseInt(limit));
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scrapeMal = async (req, res) => {
  try {
    const { url } = req.body;
    const scrapedData = await scrapeAnimeFromMAL(url);
    console.log(scrapedData);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error scraping MAL:', error);
    res.status(500).json({ error: 'Failed to scrape data from MyAnimeList' });
  }
};

exports.scrapeLivechart = async (req, res) => {
  try {
    const { url } = req.body;
    const scrapedData = await scrapeAnimeFromLiveChart(url);
    console.log(scrapedData);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error scraping LiveChart:', error);
    res.status(500).json({ error: 'Failed to scrape data from LiveChart' });
  }
};


exports.getSitemapData = async (req, res) => {
  try {
      const animes = await Anime.find({}, '_id updatedAt')
          .sort({ updatedAt: -1 })
          .limit(1000)
          .lean();

      const genres = await Genre.find({}, 'name').sort({ name: 1 }).lean();
      const types = await Type.find({}, 'name').sort({ name: 1 }).lean();

      res.json({
          animes: animes.map(anime => ({
              id: anime._id,
              updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
          })),
          genres: genres.map(genre => ({ 
              slug: encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-')),
              name: genre.name 
          })),
          types: types.map(type => ({ 
              slug: encodeURIComponent(type.name.toLowerCase().replace(/\s+/g, '-')),
              name: type.name
          }))
      });
  } catch (error) {
      console.error('Sitemap data error:', error);
      res.status(500).json({ message: 'Error fetching sitemap data', error: error.message });
  }
};