const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const upload = require('../middlewares/fileUpload');
const { validateAnimeUpload,validateAnimeUpdate } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')

router.post('/upload', upload.single('file'),authMiddleware,authorize('admin'), validateAnimeUpload, animeController.uploadAnime);
router.put('/update/:id', upload.single('file'),authMiddleware,authorize('admin'), validateAnimeUpdate, animeController.updateAnime);
router.post('/:animeId/episodes',authMiddleware,authorize('admin'), animeController.addEpisode);
router.post('/toggleEpisodeWatched',authMiddleware, animeController.toggleEpisodeWatched);
router.get('/', animeController.getAnimes);
router.get('/:id', animeController.getAnime);
router.post('/:id/rate',authMiddleware, animeController.rateAnime);
router.post('/:id/favorite',authMiddleware, animeController.addFavorite);
router.delete('/:id/favorite',authMiddleware, animeController.removeFavorite);
router.delete('/:id',authMiddleware,authorize('admin'), animeController.deleteAnime);
router.get('/:animeId/recommendations', animeController.getRecommendations);
router.get('/genre/:genre', animeController.getAnimeByGenre);
router.get('/search', animeController.searchAnime);

router.get('/anime/:animeId/episode/:episodeId', animeController.getEpisode);
router.get('/popular/anime', animeController.getPopularAnimes);
router.get('/popular/episodes', animeController.getPopularEpisodes);

module.exports = router;
