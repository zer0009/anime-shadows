const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const { validateAnimeUpload, validateAnimeUpdate } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const optionalAuth = require('../middlewares/optionalAuth');
const { upload } = require('../middlewares/fileUpload');

// Public Routes
router.get('/', animeController.getAnimes);
router.get('/search', animeController.searchAnime);
router.get('/filter', animeController.filterAnimes);
router.get('/movies', animeController.getMovies);
router.get('/genre/:genre', animeController.getAnimeByGenre);
router.get('/popular/anime', animeController.getPopularAnimes);
router.get('/popular/episodes', animeController.getPopularEpisodes);

router.post('/scrape-mal', animeController.scrapeMal);
router.post('/scrape-livechart', animeController.scrapeLivechart)

router.get('/:id', optionalAuth, animeController.getAnime);
router.get('/anime/:animeId/episode/:episodeId', animeController.getEpisode);
router.get('/:animeId/recommendations', animeController.getRecommendations);

// Authenticated Routes
router.post('/toggleEpisodeWatched', authMiddleware, animeController.toggleEpisodeWatched);
router.post('/:id/rate', authMiddleware, animeController.rateAnime);

// Admin Routes
router.post('/upload',upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpload, animeController.uploadAnime);

router.put('/update/:id',upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpdate, animeController.updateAnime);

router.post('/:animeId/episodes', authMiddleware, authorize('moderator', 'admin'), animeController.addEpisode);
router.delete('/:id', authMiddleware, authorize('admin'), animeController.deleteAnime);

module.exports = router;