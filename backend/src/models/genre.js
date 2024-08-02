const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true,trim: true },
  name_ar: { type: String, unique: true,trim: true, default: "N/A" }
});

module.exports = mongoose.model('Genre', genreSchema);