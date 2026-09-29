const jwt = require('jsonwebtoken');

// Validate a bearer token and attach the verified payload to the request.
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header required.' });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'A valid Bearer token is required.' });
    }

    try {
        req.auth = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or expired.' });
    }
};

// Restrict a route to one or more application roles.
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.auth) {
        return res.status(401).json({ message: 'Authentication is required.' });
    }

    // Accounts created before role support are intentionally treated as normal users.
    const role = req.auth.role || 'user';
    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Administrator access is required.' });
    }

    return next();
};

module.exports = {
    authenticateJWT,
    authorizeRoles
};
