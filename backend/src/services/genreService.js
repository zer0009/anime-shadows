const Genre = require('../models/genre');

const createGenre = async (name) => {
  const genre = new Genre({ name });
  await genre.save();
  return genre;
};

const getGenres = async () => {
  return await Genre.find();
};

module.exports = {
  createGenre,
  getGenres,
};