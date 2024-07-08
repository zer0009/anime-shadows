const express = require('express');
const { register, login, getFavorites, getHistory,getUsersWithHistory,getUserProfile,logout,saveAnimeToHistory } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/history/:animeId', authMiddleware, saveAnimeToHistory); // New route
router.get('/favorites', authMiddleware, getFavorites);
router.get('/history', authMiddleware, getHistory);
router.get('/history1', authMiddleware, getUsersWithHistory);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/logout', authMiddleware, logout);



module.exports = router;