require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const routes = require('./routes');
require('./db/mongoose');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://analytics.google.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://trusted.frame.com"]
    }
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compress all responses
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
// app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: [
     process.env.CORS_ORIGIN,
    'https://66ad53b9591aec0008404096--anime-shadows-front.netlify.app', // Add your Netlify preview URL here
    'http://localhost:5173' // Add your local development URL here
  ],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Serve static files
app.use('/api/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: false
}));

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, '../../front/public')));

// Set x-robots-tag header to allow indexing
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'index, follow');
  next();
});

// Routes
app.use('/api', routes);

// Serve the frontend application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front/public', 'index.html'));
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      message: 'Not Found'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Something went wrong!',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});

module.exports = app;