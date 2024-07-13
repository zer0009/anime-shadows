const Season = require('../models/season');
const { format } = require('date-fns');

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');

const createSeason = async (name, startDate, endDate) => {
  const season = new Season({ name, startDate, endDate });
  await season.save();
  return {
    ...season.toObject(),
    startDate: formatDate(season.startDate),
    endDate: formatDate(season.endDate)
  };
};

const updateSeason = async (id, name, startDate, endDate) => {
  const season = await Season.findByIdAndUpdate(id, { name, startDate, endDate }, { new: true });
  return {
    ...season.toObject(),
    startDate: formatDate(season.startDate),
    endDate: formatDate(season.endDate)
  };
};

const deleteSeason = async (id) => {
  await Season.findByIdAndDelete(id);
};

const getSeasonById = async (id) => {
  const season = await Season.findById(id);
  return {
    ...season.toObject(),
    startDate: formatDate(season.startDate),
    endDate: formatDate(season.endDate)
  };
};

const getSeasons = async () => {
  const seasons = await Season.find();
  return seasons.map(season => ({
    ...season.toObject(),
    startDate: formatDate(season.startDate),
    endDate: formatDate(season.endDate)
  }));
};

module.exports = {
  createSeason,
  getSeasons,
  updateSeason,
  deleteSeason,
  getSeasonById
};