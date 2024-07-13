const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');

// Route to fetch recent episodes
router.get('/recent', episodeController.getRecentlyUpdatedEpisodes);

// Other episode routes...
router.post('/', episodeController.createEpisode);
router.get('/:id', episodeController.getEpisodeById);
router.put('/:id', episodeController.updateEpisode);
router.delete('/:id', episodeController.deleteEpisode);
router.get('/anime/:animeId', episodeController.getEpisodesByAnimeId);

module.exports = router;