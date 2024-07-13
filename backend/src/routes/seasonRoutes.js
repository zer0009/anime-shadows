const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/', seasonController.getSeasons);
router.post('/', authMiddleware, authorize('admin'), seasonController.createSeason);
router.put('/:id', authMiddleware, authorize('admin'), seasonController.updateSeason);
router.delete('/:id', authMiddleware, authorize('admin'), seasonController.deleteSeason);

module.exports = router;