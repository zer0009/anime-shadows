const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Winter', 'Spring', 'Summer', 'Fall']
    },
    year: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;