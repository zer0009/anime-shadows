const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  quality: { type: String, required: true },
  url: { type: String, required: true },
});

const episodeSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String },
  servers: [serverSchema],
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }]
});

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true }
});

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season', required: true },
  episodes: [episodeSchema],
  pictureUrl: { type: String }, 
  myAnimeListRating: { type: Number },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  ratings: [ratingSchema],
  createdAt: { type: Date, default: Date.now },
  numberOfEpisodes: { type: Number, required: true },
  source: { type: String, default:"N/A"},
  duration: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], required: true },
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }]
});

animeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
  return sum / this.ratings.length;
};

module.exports = mongoose.model('Anime', animeSchema);