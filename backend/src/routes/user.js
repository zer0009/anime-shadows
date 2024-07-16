const express = require('express');
const { register, login, getFavorites, getHistory,getUsersWithHistory,
    getUserProfile,logout,saveAnimeToHistory,addFavorite,removeFavorite } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/history/:animeId', authMiddleware, saveAnimeToHistory); // New route
router.post('/favorites/:animeId', authMiddleware, addFavorite);
router.delete('/favorites/:animeId', authMiddleware, removeFavorite);
router.get('/favorites', authMiddleware, getFavorites);

router.get('/history', authMiddleware, getHistory);
router.get('/history1', authMiddleware, getUsersWithHistory);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/logout', authMiddleware, logout);



module.exports = router;