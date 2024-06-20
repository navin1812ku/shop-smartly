const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.details.role)) {
            return res.status(403).json({
                message: 'Forbidden: You do not have the necessary permissions'
            });
        }
        next();
    };
};

module.exports = { verifyRole };