require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const animeRoutes = require('./routes/animeRoutes');
const typeRoutes = require('./routes/typeRoutes');
const genreRoutes = require('./routes/genreRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
require('./db/mongoose');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Serve static files
app.use('/api/uploads', express.static('uploads'));

// Routes
app.use('/api/anime', animeRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({
    error: {
      message: err.message || 'Something went wrong!',
      // Optionally include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

module.exports = app;