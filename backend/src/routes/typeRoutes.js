const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const authMiddleware = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/roleMiddleware')

router.post('/',authMiddleware,authorize('admin'), typeController.createType);
router.get('/', typeController.getTypes);

module.exports = router;