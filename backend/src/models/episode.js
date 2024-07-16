const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  quality: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['streaming', 'download'], required: true } // New field to differentiate server types
});

const episodeSchema = new mongoose.Schema({
  anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
  number: { type: Number, required: true },
  title: { type: String },
  streamingServers: [serverSchema], // Separate array for streaming servers
  downloadServers: [serverSchema], // Separate array for download servers
  viewCount: { type: Number, default: 0 },
  views: [{ type: Date, default: Date.now }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Episode', episodeSchema);