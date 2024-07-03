const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Type', typeSchema);