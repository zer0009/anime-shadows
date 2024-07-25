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
// app.use(helmet()); // Security headers
// app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://anime-shadows-front.netlify.app' : 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware to set CORS headers for static files
// app.use('/api/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });
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
  res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = app;