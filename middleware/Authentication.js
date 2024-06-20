const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    console.log(req.header('Authorization'));
    const authHeader = req.header('Authorization');
    if (authHeader == null) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Access denied'
        });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, details) => {
            if (err) return res.sendStatus(401);
            req.details = details;
            console.log(req.details);
            next();
        });
    } catch (error) {
        res.status(400).json({
            message: 'Invalid token'
        });
    }
};

module.exports = { verifyToken };
