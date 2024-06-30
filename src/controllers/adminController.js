const User = require('../models/user');

exports.createAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password, role: 'admin' });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
