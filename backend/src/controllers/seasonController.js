const SeasonService = require('../services/seasonService');

exports.createSeason = async (req, res) => {
  const { name, startDate, endDate } = req.body;

  try {
    const newSeason = await SeasonService.createSeason(name, startDate, endDate);
    res.status(201).json(newSeason);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSeasons = async (req, res) => {
  try {
    const seasons = await SeasonService.getSeasons();
    res.json(seasons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSeason = async (req, res) => {
  const { id, name, startDate, endDate } = req.body;
  try {
    const updatedSeason = await SeasonService.updateSeason(id, name, startDate, endDate);
    res.json(updatedSeason);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSeason = async (req, res) => {
  const { id } = req.params;
  try {
    await SeasonService.deleteSeason(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSeasonById = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await SeasonService.getSeasonById(id);
    res.json(season);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};