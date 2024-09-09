const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const { validateAnimeUpload, validateAnimeUpdate } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const optionalAuth = require('../middlewares/optionalAuth');
const { upload } = require('../middlewares/fileUpload');
const { scrapeWitanime } = require('../utils/witanimeScraper');
const { scrapeAnimeLuxe } = require('../utils/animeluxeScraper');
const { scrapeGogoanime } = require('../utils/scrapeGogoanime');

// Batch route should be defined before any routes that might interpret "batch" as an ID
router.post('/batch', authMiddleware, animeController.getAnimesByIds);

// Public Routes
router.get('/', animeController.getAnimes);
router.get('/search', animeController.searchAnime);
router.get('/filter', animeController.filterAnimes);
router.get('/movies', animeController.getMovies);
router.get('/genre/:genre', animeController.getAnimeByGenre);
router.get('/popular/anime', animeController.getPopularAnimes);
router.get('/popular/episodes', animeController.getPopularEpisodes);

router.get('/slug/:slug', optionalAuth, animeController.getAnimeBySlug);

router.get('/myAnimeList/:animeId', animeController.getMyAnimeList);

router.get('/sitemap-data', animeController.getSitemapData);

router.post('/scrape-mal', animeController.scrapeMal);
router.post('/scrape-livechart', animeController.scrapeLivechart);

// New Route for Scraping Witanime
router.get('/scrape-witanime', async (req, res) => {
  const { url } = req.query;

  try {
    const servers = await scrapeWitanime(url);
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    res.json(servers);
  } catch (error) {
    console.error('Error scraping Witanime:', error);
    res.status(500).json({ error: 'Failed to scrape Witanime' });
  }
});

router.get('/scrape-animeluxe', async (req, res) => {
  const { url } = req.query;

  try {
    const servers = await scrapeAnimeLuxe(url);
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    res.json(servers);
  } catch (error) {
    console.error('Error scraping AnimeLuxe:', error);
    res.status(500).json({ error: 'Failed to scrape AnimeLuxe' });
  }
});

router.get('/scrape-gogoanime', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await scrapeGogoanime(url);
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    res.json(result);
  } catch (error) {
    console.error('Error scraping Gogoanime:', error);
    res.status(500).json({ error: 'Failed to scrape Gogoanime' });
  }
});

router.get('/:id', optionalAuth, animeController.getAnime);
router.get('/anime/:animeId/episode/:episodeId', animeController.getEpisode);
router.get('/:animeId/recommendations', animeController.getRecommendations);

// router.get('/:animeId/viewing-history', authMiddleware, animeController.getViewingHistory);
// router.post('/:animeId/episodes/:episodeId/watch', authMiddleware, animeController.markEpisodeAsWatched);
// router.post('/:animeId/episodes/:episodeId/unwatch', authMiddleware, animeController.markEpisodeAsUnwatched);

router.get('/viewingHistory/:animeId', authMiddleware, animeController.getViewingHistory);
router.post('/viewingHistory/watched', authMiddleware, animeController.markAsWatched);
router.post('/viewingHistory/unwatched', authMiddleware, animeController.markAsUnwatched);

// Authenticated Routes
router.post('/toggleEpisodeWatched', authMiddleware, animeController.toggleEpisodeWatched);

router.post('/:id/rate', authMiddleware, animeController.rateAnime);

// Admin Routes
router.post('/upload',upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpload, animeController.uploadAnime);

router.put('/update/:id',upload.single('file'), authMiddleware, authorize('moderator', 'admin'), validateAnimeUpdate, animeController.updateAnime);

router.post('/:animeId/episodes', authMiddleware, authorize('moderator', 'admin'), animeController.addEpisode);
router.delete('/:id', authMiddleware, authorize('admin'), animeController.deleteAnime);

module.exports = router;