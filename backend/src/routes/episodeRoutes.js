const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/recent', episodeController.getRecentlyUpdatedEpisodes);
router.get('/:id', episodeController.getEpisodeById);
router.get('/anime/:animeId', episodeController.getEpisodesByAnimeId);
router.get('/', episodeController.getEpisodeBySlugAndNumber); 
router.post('/', authMiddleware, authorize('admin', 'moderator'), episodeController.createEpisode);
router.put('/:id', authMiddleware, authorize('admin'), episodeController.updateEpisode);
router.delete('/:id', authMiddleware, authorize('admin'), episodeController.deleteEpisode);


module.exports = router;