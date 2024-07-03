const Type = require('../models/type');

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

module.exports = {
  createType,
  getTypes
};

