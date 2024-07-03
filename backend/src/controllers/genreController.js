const GenreService = require('../services/genreService');

exports.createGenre = async (req, res) => {
  const { name } = req.body;

  try {
    const newGenre = await GenreService.createGenre(name);
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await GenreService.getGenres();
    res.json(genres);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};