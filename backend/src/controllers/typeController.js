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