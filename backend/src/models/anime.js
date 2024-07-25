const mongoose = require('mongoose');
const { fetchMyAnimeListRating } = require('../utils/myAnimeList');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true }
});

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true, index: true },
  description: { type: String, required: true, trim: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season', index: true },
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
  pictureUrl: { type: String },
  myAnimeListUrl: { type: String },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', index: true },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', index: true }],
  ratings: [ratingSchema],
  createdAt: { type: Date, default: Date.now, index: true },
  numberOfEpisodes: { type: Number, default: 0 },
  source: { type: String, default: "N/A" },
  duration: { type: String, default: "N/A" },
  airingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], default: "upcoming", index: true },
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }]
});

// Calculate average rating using aggregation
animeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
  return sum / this.ratings.length;
};

// Get user count
animeSchema.methods.getUserCount = function() {
  return this.ratings.length;
};

// Fetch MyAnimeList data
animeSchema.methods.fetchMyAnimeListData = async function() {
  const { rating, userCount } = await fetchMyAnimeListRating(this.myAnimeListUrl);
  return { rating, userCount };
};

// Use lean queries for read-only operations
animeSchema.statics.findLean = function(query) {
  return this.find(query).lean().exec();
};

// Cache frequently accessed data (example using a simple in-memory cache)
const cache = new Map();

animeSchema.statics.findWithCache = async function(query) {
  const key = JSON.stringify(query);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = await this.find(query).lean().exec();
  cache.set(key, result);
  return result;
};

module.exports = mongoose.model('Anime', animeSchema);