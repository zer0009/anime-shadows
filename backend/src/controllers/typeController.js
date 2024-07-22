const TypeService = require('../services/typeService');

exports.createType = async (req, res) => {
  const { name } = req.body;

  try {
    const newType = await TypeService.createType(name);
    res.status(201).json(newType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await TypeService.getTypes();
    res.json(types);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTypeById = async (req, res) => {
  try {
    const type = await TypeService.getTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Type not found' });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching type', error });
  }
};

exports.getAnimesByTypeId = async (req, res) => {
  try {
    const animes = await TypeService.getAnimesByTypeId(req.params.id);
    if (!animes || animes.length === 0) {
      return res.status(404).json({ message: 'No animes found for this type' });
    }
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animes', error });
  }
};

exports.updateType = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const updatedType = await TypeService.updateType(id, name);
    res.json(updatedType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    await TypeService.deleteType(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};