const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Anime = require('../models/anime');

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
    // const username = user.username
    // const role = user.role
    res.json({ token, username: user.username, role: user.role});
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

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites history');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userInfo } = user._doc; // Exclude password from the response
    res.json(userInfo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to log out' });
  }
};

exports.saveAnimeToHistory = async (req, res) => {
    try {
        const { animeId } = req.params;
        const userId = req.user._id;

        if (!animeId) {
            return res.status(400).json({ message: 'Anime ID is required' });
        }

        const anime = await Anime.findById(animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the anime is already in the user's history
        const historyItem = user.history.find(item => item.anime && item.anime.toString() === animeId);
        if (historyItem) {
            // Update the view date
            historyItem.views.push(new Date());
        } else {
            // Add new history item
            user.history.push({ anime: animeId, views: [new Date()], pictureUrl: anime.pictureUrl, title: anime.title });
        }

        await User.findByIdAndUpdate(userId, { history: user.history }, { new: true, upsert: true });
        res.status(200).json({ message: 'Anime saved to history' });
    } catch (error) {
        console.error('Error saving anime to history:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

