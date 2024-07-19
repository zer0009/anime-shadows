const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');


router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenreById);

router.post('/', authMiddleware, authorize('admin', 'moderator'), genreController.createGenre);
router.put('/:id', authMiddleware, authorize('admin'), genreController.updateGenre);
router.delete('/:id', authMiddleware, authorize('admin'), genreController.deleteGenre);

module.exports = router;