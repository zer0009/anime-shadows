const roleMiddleware = (...requiredRoles) => {
    return (req, res, next) => {
        if (req.user && requiredRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
};
  
module.exports = roleMiddleware;
