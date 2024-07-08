const jwt = require('jsonwebtoken');
const User = require('../models/user');

const optionalAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next(); // No token, proceed without setting req.user
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (user) {
            req.user = user;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
    }

    next();
};

module.exports = optionalAuth;