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
const Episode = require('../models/episode');

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
      type: typeId, // Use type instead of typeId
      season: seasonId, // Use season instead of seasonId
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

    // Validate type and season
    if (!animeData.type || !animeData.season) {
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
    res.json(scrapedData);
  } catch (error) {
    console.error('Error scraping LiveChart:', error);
    res.status(500).json({ error: 'Failed to scrape data from LiveChart' });
  }
};


exports.getSitemapData = async (req, res) => {
  try {
    const animes = await Anime.find({}, '_id updatedAt slug')
      .sort({ updatedAt: -1 })
      .limit(1000)
      .lean();

    const genres = await Genre.find({}, 'name').sort({ name: 1 }).lean();
    const types = await Type.find({}, 'name').sort({ name: 1 }).lean();

    // Fetch recent episodes
    const recentEpisodes = await Episode.find({}, 'number createdAt anime')
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('anime', 'slug')
      .lean();

    console.log('Recent episodes query result:', recentEpisodes);

    // Fetch popular anime (assuming you have a viewCount field)
    const popularAnime = await Anime.find({}, '_id updatedAt slug viewCount')
      .sort({ viewCount: -1 })
      .limit(50)
      .lean();

    res.json({
      animes: animes.map(anime => ({
        id: anime._id,
        slug: anime.slug ? encodeURIComponent(anime.slug.toLowerCase().replace(/\s+/g, '-')) : `Not Found ${anime._id}`,
        updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
      })),
      genres: genres.map(genre => ({ 
        slug: encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-')),
        name: genre.name 
      })),
      types: types.map(type => ({ 
        slug: encodeURIComponent(type.name.toLowerCase().replace(/\s+/g, '-')),
        name: type.name
      })),
      recentEpisodes: recentEpisodes.map(episode => ({
        animeSlug: episode.anime ? episode.anime.slug : 'unknown',
        number: episode.number,
        createdAt: episode.createdAt.toISOString()
      })),
      popularAnime: popularAnime.map(anime => ({
        id: anime._id,
        slug: anime.slug ? encodeURIComponent(anime.slug.toLowerCase().replace(/\s+/g, '-')) : `Not Found ${anime._id}`,
        updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
      }))
    });
  } catch (error) {
    console.error('Sitemap data error:', error);
    res.status(500).json({ message: 'Error fetching sitemap data', error: error.message });
  }
};

exports.getMyAnimeList = async (req, res) => {
  const { animeId } = req.params;
  try {
    const myAnimeList = await AnimeService.getMyAnimeListData(animeId);
    res.json(myAnimeList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.markEpisodeAsWatched = async (req, res) => {
//   const { animeId, episodeId } = req.params;

//   try {
//     const result = await AnimeService.markEpisodeAsWatched(req.user._id, animeId, episodeId);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.markEpisodeAsUnwatched = async (req, res) => {
//   const { animeId, episodeId } = req.params;

//   try {
//     const result = await AnimeService.markEpisodeAsUnwatched(req.user._id, animeId, episodeId);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.getViewingHistory = async (req, res) => {
//   const { animeId } = req.params;

//   try {
//     const viewingHistory = await AnimeService.getViewingHistory(req.user._id, animeId);
//     res.status(200).json(viewingHistory);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

exports.markAsWatched = async (req, res) => {
  try {
    const { animeId, episodeId } = req.body;
    const user = req.user;

    const viewedEpisode = {
      animeId: new mongoose.Types.ObjectId(animeId),
      episodeId: new mongoose.Types.ObjectId(episodeId),
      viewedAt: new Date()
    };

    user.viewingHistory.push(viewedEpisode);
    await user.save();

    res.status(201).send(user.viewingHistory);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.markAsUnwatched = async (req, res) => {
  try {
    const { animeId, episodeId } = req.body;
    const user = req.user;


    user.viewingHistory = user.viewingHistory.filter((viewed) => {
      if (!viewed.animeId || !viewed.episodeId) {
        console.error('Invalid entry in viewing history:', viewed);
        return true; // Keep invalid entries for further inspection
      }
      return !(viewed.animeId.equals(new mongoose.Types.ObjectId(animeId)) && viewed.episodeId.equals(new mongoose.Types.ObjectId(episodeId)));
    });

    await user.save();

    res.status(200).send(user.viewingHistory);
  } catch (error) {
    console.error('Error in markAsUnwatched:', error);
    res.status(400).send(error);
  }
};

exports.getViewingHistory = async (req, res) => {
  try {
    const { animeId } = req.params;
    const user = req.user;

    const viewingHistory = user.viewingHistory.filter(viewed => viewed.animeId.equals(new mongoose.Types.ObjectId(animeId)));

    res.status(200).send(viewingHistory);
  } catch (error) {
    console.error('Error in getViewingHistory:', error);
    res.status(400).send(error);
  }
};

exports.getAnimeBySlug = async (req, res) => {
  const { slug } = req.params;
  const user = req.user;

  try {
    const anime = user ? await AnimeService.getAnimeBySlug(slug, user._id) : await AnimeService.getAnimeBySlug(slug);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    if (user) {
      await AnimeService.addToHistory(user._id, anime._id);
    }

    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnimesByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty IDs array' });
    }

    const animes = await AnimeService.getAnimesByIds(ids);
    res.status(200).json(animes);
  } catch (error) {
    console.error('Error fetching animes by IDs:', error); // Add logging
    res.status(500).json({ error: 'Failed to fetch animes' });
  }
};