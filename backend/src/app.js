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
require('dotenv').config({ path: `./config/${process.env.NODE_ENV}.env` });
require('./db/mongoose');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Static files
app.use('/api/uploads', express.static('uploads'));

// Routes
app.use('/api/anime', animeRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/episodes', episodeRoutes);


app.use('/api/user',userRoutes)
app.use(adminRoutes);


module.exports = app