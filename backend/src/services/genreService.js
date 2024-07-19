const Genre = require('../models/genre');

const createGenre = async (name) => {
  const genre = new Genre({ name });
  await genre.save();
  return genre;
};

const getGenres = async () => {
  return await Genre.find();
};

const getGenreById = async (id) => {
  return await Genre.findById(id).populate('anime');
};

const updateGenre = async (id, name) => {
  return await Genre.findByIdAndUpdate(id, { name: name.trim() });
};

const deleteGenre = async (id) => {
  return await Genre.findByIdAndDelete(id);
};

module.exports = {
  createGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre
};