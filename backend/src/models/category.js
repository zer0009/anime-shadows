const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, enum: ['tv', 'movie','ova','ona'], unique: true, default:"tv" }
});

module.exports = mongoose.model('Category', categorySchema);