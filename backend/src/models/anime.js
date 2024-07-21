const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true }
});

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
  pictureUrl: { type: String },
  myAnimeListRating: { type: Number },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  ratings: [ratingSchema],
  createdAt: { type: Date, default: Date.now },
  numberOfEpisodes: { type: Number, default: 0 },
  source: { type: String, default: "N/A" },
  duration: { type: String, default: "N/A" },
  airingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], default: "upcoming" },
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }]
});

animeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
  return sum / this.ratings.length;
};

animeSchema.methods.getUserCount = function() {
  return this.ratings.length;
};

module.exports = mongoose.model('Anime', animeSchema);