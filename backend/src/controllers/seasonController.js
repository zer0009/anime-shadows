const SeasonService = require('../services/seasonService');

exports.createSeason = async (req, res) => {
  try {
    const { name, year, startDate, endDate } = req.body;
    if (!name || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newSeason = await SeasonService.createSeason(name, year, startDate, endDate);
    res.status(201).json(newSeason);
  } catch (error) {
    console.error('Error adding season:', error);
    res.status(400).json({ error: error.message });
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
  try {
    const { name, year, startDate, endDate } = req.body;
    if (!name || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const updatedSeason = await SeasonService.updateSeason(req.params.id, name, year, startDate, endDate);
    res.status(200).json(updatedSeason);
  } catch (error) {
    console.error('Error updating season:', error);
    res.status(400).json({ error: error.message });
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