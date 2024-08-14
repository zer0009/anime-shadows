const GenreService = require('../services/genreService');

exports.createGenre = async (req, res) => {
  const { name, name_ar } = req.body;

  try {
    const newGenre = await GenreService.createGenre(name, name_ar);
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

exports.getGenreById = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await GenreService.getGenreById(id);
    res.json(genre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateGenre = async (req, res) => {
  const { name, name_ar } = req.body;
  const { id } = req.params;
  try {
    const updatedGenre = await GenreService.updateGenre(id, name, name_ar);
    res.json(updatedGenre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGenre = async (req, res) => {
  const { id } = req.params;
  try {
    await GenreService.deleteGenre(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};