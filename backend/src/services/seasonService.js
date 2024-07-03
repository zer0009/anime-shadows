const Season = require('../models/season');

const createSeason = async (name) => {
  let season = await Season.findOne({ name: name.trim() });
  if (!season) {
    season = new Season({ name: name.trim() });
    await season.save();
  }
  return season;
};

const getSeasons = async () => {
  return await Season.find();
};

module.exports = {
  createSeason,
  getSeasons
};