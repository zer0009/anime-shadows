const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const adminRoutes = require('./admin');
const animeRoutes = require('./animeRoutes');
const typeRoutes = require('./typeRoutes');
const genreRoutes = require('./genreRoutes');
const seasonRoutes = require('./seasonRoutes');
const episodeRoutes = require('./episodeRoutes');

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/anime', animeRoutes);
router.use('/types', typeRoutes);
router.use('/genres', genreRoutes);
router.use('/seasons', seasonRoutes);
router.use('/episodes', episodeRoutes);

module.exports = router;