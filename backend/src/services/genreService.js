const Genre = require('../models/genre');

const createGenre = async (name, name_ar) => {
  const genre = new Genre({ name, name_ar });
  await genre.save();
  return genre;
};

const getGenres = async () => {
  return await Genre.find();
};

const getGenreById = async (id) => {
  return await Genre.findById(id).populate('anime');
};

const updateGenre = async (id, name, name_ar) => {
  return await Genre.findByIdAndUpdate(id, { name: name.trim(), name_ar: name_ar.trim() });
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