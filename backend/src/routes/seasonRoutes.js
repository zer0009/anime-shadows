const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');

router.post('/', seasonController.createSeason);
router.get('/', seasonController.getSeasons);

module.exports = router;