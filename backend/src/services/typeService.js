const Type = require('../models/type');
const Anime = require('../models/anime');

const createType = async (name) => {
  let type = await Type.findOne({ name: name.trim() });
  if (!type) {
    type = new Type({ name: name.trim() });
    await type.save();
  }
  return type;
};

const getTypes = async () => {
  return await Type.find();
};

const getTypeById = async (id) => {
  return await Type.findById(id);
};

const getAnimesByTypeId = async (typeId) => {
  return await Anime.find({ type: typeId });
};


const updateType = async (id, name) => {
  return await Type.findByIdAndUpdate(id, { name: name.trim() });
};

const deleteType = async (id) => {
  return await Type.findByIdAndDelete(id);
};

module.exports = {
  createType,
  getTypes,
  updateType,
  deleteType,
  getTypeById,
  getAnimesByTypeId
};


