const Anime = require('../models/anime');
const User = require('../models/user');
const Category = require('../models/category');
const { fetchMyAnimeListRating } = require('../utils/myAnimeList');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

// Ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Temporarily use a generic name
    cb(null, 'temp-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

exports.uploadAnime = [
  upload.single('file'),
  body('categoryId').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid category ID'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete the uploaded file if validation fails
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, myAnimeListUrl, categoryId, tags } = req.body;
    const file = req.file;

    try {
      const category = await Category.findById(categoryId.trim());
      if (!category) {
        if (file) {
          fs.unlinkSync(file.path); // Delete the uploaded file if category is not found
        }
        return res.status(404).json({ error: 'Category not found' });
      }

      let myAnimeListRating = null;
      if (myAnimeListUrl) {
        myAnimeListRating = await fetchMyAnimeListRating(myAnimeListUrl);
      }

      const newAnime = new Anime({
        title,
        description,
        myAnimeListRating,
        category: categoryId.trim(),
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        pictureUrl: undefined // Initially set to undefined
      });

      await newAnime.save();

      if (file) {
        const newFileName = `${title.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
        const newFilePath = path.join(uploadDir, newFileName);
        fs.renameSync(file.path, newFilePath); // Rename the file
        newAnime.pictureUrl = `/uploads/${newFileName}`;
        await newAnime.save(); // Save the updated anime with the picture URL
      }

      res.status(201).json(newAnime);
    } catch (err) {
      if (file) {
        fs.unlinkSync(file.path); // Delete the uploaded file if an error occurs
      }
      res.status(400).json({ error: err.message });
    }
  }
];

exports.updateAnime = [
  upload.single('file'),
  body('categoryId').optional().isMongoId().withMessage('Invalid category ID'),
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete the uploaded file if validation fails
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, myAnimeListRating, categoryId, tags } = req.body;
    const file = req.file;

    try {
      const anime = await Anime.findById(req.params.id);
      if (!anime) {
        if (file) {
          fs.unlinkSync(file.path); // Delete the uploaded file if anime is not found
        }
        return res.status(404).json({ error: 'Anime not found' });
      }

      if (title) anime.title = title;
      if (description) anime.description = description;
      if (myAnimeListRating) anime.myAnimeListRating = myAnimeListRating;
      if (categoryId) anime.category = categoryId.trim();
      if (tags) anime.tags = tags;

      if (file) {
        // Delete the old picture if it exists
        if (anime.pictureUrl) {
          const oldFilePath = path.join(__dirname, '..', anime.pictureUrl);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        const newFileName = `${anime.title.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;
        const newFilePath = path.join(uploadDir, newFileName);
        fs.renameSync(file.path, newFilePath); // Rename the file
        anime.pictureUrl = `/uploads/${newFileName}`;
      }

      await anime.save();
      res.json(anime);
    } catch (err) {
      if (file) {
        fs.unlinkSync(file.path); // Delete the uploaded file if an error occurs
      }
      res.status(400).json({ error: err.message });
    }
  }
];

exports.addEpisode = async (req, res) => {
  const { animeId } = req.params;
  const { number, title, servers } = req.body;

  try {
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    const newEpisode = {
      number,
      title,
      servers: servers.map(server => ({
        serverName: server.serverName,
        quality: server.quality,
        url: server.url,
      })),
    };

    anime.episodes.push(newEpisode);
    await anime.save();

    res.status(201).json(anime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.toggleEpisodeWatched = async (req, res) => {
  const { animeId, episodeNumber } = req.body;

  try {
    // Validate user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate anime
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    // Validate episode
    const episode = anime.episodes.find(ep => ep.number === episodeNumber);
    if (!episode) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    // Check if the episode is already marked as watched
    const watchedIndex = user.viewingHistory.findIndex(
      history => history.animeId.toString() === animeId && history.episodeNumber === episodeNumber
    );

    if (watchedIndex !== -1) {
      // Episode is already marked as watched, so unmark it
      user.viewingHistory.splice(watchedIndex, 1);
      await user.save();
      return res.status(200).json({ message: 'Episode unmarked as watched', viewingHistory: user.viewingHistory });
    } else {
      // Episode is not marked as watched, so mark it
      user.viewingHistory.push({ animeId, episodeNumber });
      await user.save();
      return res.status(201).json({ message: 'Episode marked as watched', viewingHistory: user.viewingHistory });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnimes = async (req, res) => {
  try {
    const animes = await Anime.find().populate('category');
    res.json(animes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).populate('category');
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    res.json(anime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rateAnime = [
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const anime = await Anime.findById(req.params.id);
      if (!anime) {
        return res.status(404).json({ error: 'Anime not found' });
      }

      const existingRating = anime.ratings.find(r => r.userId.toString() === req.user._id.toString());

      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating;
      } else {
        // Add new rating
        anime.ratings.push({ userId: req.user._id, rating });
      }

      await anime.save();
      res.json(anime.calculateAverageRating());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    if (user.favorites.includes(anime._id)) {
      return res.status(400).json({ error: 'Anime already in favorites' });
    }

    user.favorites.push(anime._id);
    await user.save();
    res.status(201).json(user.favorites);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const animeIndex = user.favorites.indexOf(req.params.id);
    if (animeIndex === -1) {
      return res.status(404).json({ error: 'Anime not found in favorites' });
    }

    user.favorites.splice(animeIndex, 1);
    await user.save();
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    res.json({ message: 'Anime deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { animeId } = req.params;

  try {
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    // Find users who have watched or completed all episodes of the anime
    const users = await User.find({
      $or: [
        { 'viewingHistory.animeId': animeId },
        { 'favorites': animeId }
      ]
    });

    // Collect all anime IDs watched or favorited by these users
    const animeIds = new Set();
    users.forEach(user => {
      user.viewingHistory.forEach(history => animeIds.add(history.animeId.toString()));
      user.favorites.forEach(favorite => animeIds.add(favorite.toString()));
    });

    // Convert Set to Array
    const animeIdArray = Array.from(animeIds);

    // Find anime that match the tags and are in the collected anime IDs
    // $ne is a MongoDB query operator that stands for "not equal".
    // $in is a MongoDB query operator that checks if a field's value is in a specified array
    const recommendations = await Anime.find({
      _id: { $in: animeIdArray, $ne: animeId },
      tags: { $in: anime.tags }
    }).sort({ myAnimeListRating: -1 }).limit(10);

    res.json(recommendations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnimeByTag = async (req, res) => {
  const { tag } = req.params;

  try {
    const animes = await Anime.find({ tags: tag });
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
    const animes = await Anime.find({
      //$or It takes an array of conditions and returns documents that match at least one of the conditions.
      // $regex is a MongoDB operator that allows for regular expression matching
      // $options: 'i' makes the search case-insensitive (i stands for "ignore case").
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(animes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};