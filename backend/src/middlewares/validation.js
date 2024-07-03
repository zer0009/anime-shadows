const { body } = require('express-validator');

const validateAnimeUpload = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('seasonId').notEmpty().withMessage('Season is required').isMongoId().withMessage('Invalid season ID'),
  body('typeId').notEmpty().withMessage('Type is required').isMongoId().withMessage('Invalid type ID'),
  body('genres').exists().withMessage('Genres are required'),
  body('source').optional(),
  body('duration').exists().withMessage('Duration is required'),
  body('status').exists().isIn(['ongoing', 'completed', 'upcoming']).withMessage('Invalid status'),
  body('numberOfEpisodes').isInt({ min: 1 }).withMessage('Number of episodes is required and must be a positive integer'),
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10')
];

const validateAnimeUpdate = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('seasonId').optional().isMongoId().withMessage('Invalid season ID'),
  body('typeId').optional().isMongoId().withMessage('Invalid type ID'),
  body('genres').optional(),
  body('source').optional(),
  body('duration').optional(),
  body('status').optional().isIn(['ongoing', 'completed', 'upcoming']).withMessage('Invalid status'),
  body('numberOfEpisodes').optional().isInt({ min: 1 }).withMessage('Number of episodes must be a positive integer'),

];

const validateUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

module.exports = {
  validateAnimeUpload,
  validateAnimeUpdate
};