const SeasonService = require('../services/seasonService');

exports.createSeason = async (req, res) => {
  const { name } = req.body;

  try {
    const newSeason = await SeasonService.createSeason(name);
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