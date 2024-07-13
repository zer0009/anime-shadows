const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const upload = require('../middlewares/fileUpload');
const { validateAnimeUpload, validateAnimeUpdate } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const optionalAuth = require('../middlewares/optionalAuth');

// Public Routes
router.get('/', animeController.getAnimes);
router.get('/search', animeController.searchAnime);
router.get('/filter', animeController.filterAnimes);
router.get('/genre/:genre', animeController.getAnimeByGenre);
router.get('/popular/anime', animeController.getPopularAnimes);
router.get('/popular/episodes', animeController.getPopularEpisodes);
router.get('/:id', optionalAuth, animeController.getAnime);
router.get('/anime/:animeId/episode/:episodeId', animeController.getEpisode);
router.get('/:animeId/recommendations', animeController.getRecommendations);

// Authenticated Routes
router.post('/toggleEpisodeWatched', authMiddleware, animeController.toggleEpisodeWatched);
router.post('/:id/rate', authMiddleware, animeController.rateAnime);
router.post('/:id/favorite', authMiddleware, animeController.addFavorite);
router.delete('/:id/favorite', authMiddleware, animeController.removeFavorite);

// Admin Routes
router.post('/upload', upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpload, animeController.uploadAnime);
router.put('/update/:id', upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpdate, animeController.updateAnime);
router.post('/:animeId/episodes', authMiddleware, authorize('moderator', 'admin'), animeController.addEpisode);
router.delete('/:id', authMiddleware, authorize('admin'), animeController.deleteAnime);

module.exports = router;