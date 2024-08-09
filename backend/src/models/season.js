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
    },
    endDate: {
        type: Date,
    }
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;