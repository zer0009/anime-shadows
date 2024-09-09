const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  quality: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['streaming', 'download'], required: true },
  subtitle: { type: String, enum: ['AR', 'EN', 'RAW'], default: 'AR' }
});

const episodeSchema = new mongoose.Schema({
  anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
  number: { type: Number, required: true },
  title: { type: String },
  streamingServers: [serverSchema],
  downloadServers: [serverSchema],
  availableSubtitles: [{ type: String, enum: ['AR', 'EN', 'RAW'] }],
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update availableSubtitles and updatedAt field on save
episodeSchema.pre('save', function(next) {
  const subtitles = new Set();
  
  this.streamingServers.concat(this.downloadServers).forEach(server => subtitles.add(server.subtitle));
  
  this.availableSubtitles = Array.from(subtitles).sort();
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

// Middleware to update the updatedAt field on update
episodeSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Episode', episodeSchema);