const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({ username, email, password});
    await newUser.save();
    await newUser.generateAuthToken()
    // res.status(201).send({user,token })
    res.status(201).json({ message: 'User created'});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = await user.generateAuthToken()
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('favorites');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user.favorites);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getHistory = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('viewingHistory.animeId');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user.viewingHistory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

exports.getUsersWithHistory = async (req, res) => {
  try {
    const users = await User.find().populate('viewingHistory.animeId', 'title');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};