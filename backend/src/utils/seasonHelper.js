const Season = require('../models/season');

const getOrCreateSeason = async (seasonName, year) => {
    try {
        let season = await Season.findOne({ name: seasonName, year });

        if (!season) {
            // Calculate start and end dates
            const startDates = {
                'Winter': `${year}-01-01`,
                'Spring': `${year}-04-01`,
                'Summer': `${year}-07-01`,
                'Fall': `${year}-10-01`
            };

            const endDates = {
                'Winter': `${year}-03-31`,
                'Spring': `${year}-06-30`,
                'Summer': `${year}-09-30`,
                'Fall': `${year}-12-31`
            };

            season = await Season.create({
                name: seasonName,
                year,
                startDate: new Date(startDates[seasonName]),
                endDate: new Date(endDates[seasonName])
            });
        }

        return season;
    } catch (error) {
        console.error('Error in getOrCreateSeason:', error);
        throw error;
    }
};

module.exports = { getOrCreateSeason };