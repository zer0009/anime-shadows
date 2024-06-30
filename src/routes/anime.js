const express = require('express');
const { uploadAnime, addEpisode, toggleEpisodeWatched,
     getAnimes,getRecommendations, getAnime, rateAnime,
      addFavorite, updateAnime, deleteAnime,removeFavorite,
       getAnimeByTag, searchAnime } = require('../controllers/animeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware,roleMiddleware('admin'), uploadAnime);
router.post('/:animeId/episodes', authMiddleware,roleMiddleware('admin'), addEpisode);
router.post('/toggleEpisodeWatched', authMiddleware, toggleEpisodeWatched);
router.get('/', getAnimes);
router.get('/search', searchAnime);
router.get('/:id', getAnime);
router.post('/:id/rate', authMiddleware, rateAnime);
router.post('/:id/favorite', authMiddleware, addFavorite);
router.delete('/:id/favorite', authMiddleware, removeFavorite);
router.get('/:animeId/recommendations', authMiddleware, getRecommendations);
router.get('/tag/:tag', getAnimeByTag);


router.put('/:id', authMiddleware,roleMiddleware('admin'), updateAnime);
router.delete('/:id', authMiddleware,roleMiddleware('admin'), deleteAnime);


module.exports = router;