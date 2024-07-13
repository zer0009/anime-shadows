const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true,trim: true,lowercase: true }
});

module.exports = mongoose.model('Genre', genreSchema);