const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const authMiddleware = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')


router.get('/', typeController.getTypes);
router.get('/:id', typeController.getTypeById);
router.get('/:id/animes', typeController.getAnimesByTypeId);

router.post('/',authMiddleware,authorize('admin', 'moderator'), typeController.createType);
router.put('/:id', authMiddleware, authorize('admin'), typeController.updateType);
router.delete('/:id', authMiddleware, authorize('admin'), typeController.deleteType);

module.exports = router;