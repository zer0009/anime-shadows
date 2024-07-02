const express = require('express');
const { register, login, getFavorites, getHistory,getUsersWithHistory } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/favorites', authMiddleware, getFavorites);
router.get('/history', authMiddleware, getHistory);
router.get('/history1', authMiddleware, getUsersWithHistory);

module.exports = router;