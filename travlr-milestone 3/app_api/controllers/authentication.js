const User = require('../models/user');
const passport = require('passport');
const { loginAttemptTracker } = require('../security/login-attempt-tracker');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    try {
        // The role is intentionally not accepted from the registration request.
        // New accounts are normal users unless an administrator promotes them in MongoDB.
        const user = new User({
            name: String(req.body.name).trim(),
            email: String(req.body.email).trim(),
            role: 'user'
        });

        user.setPassword(req.body.password);
        await user.save();

        const token = user.generateJWT();
        return res.status(201).json({ token });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ message: 'An account with that email already exists.' });
        }

        return res.status(400).json({ message: 'Unable to register user.' });
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    const email = String(req.body.email).trim();
    req.body.email = email;

    // The tracker normalizes the email key internally so attempt tracking is case-insensitive
    // without changing how existing account emails are queried by Passport.
    const attemptStatus = loginAttemptTracker.getStatus(email);
    if (attemptStatus.locked) {
        const retryAfterSeconds = Math.max(
            1,
            Math.ceil(attemptStatus.retryAfterMs / 1000)
        );

        res.set('Retry-After', String(retryAfterSeconds));
        return res.status(429).json({
            message: 'Account temporarily locked after repeated failed login attempts. Try again later.'
        });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Authentication service error.' });
        }

        if (user) {
            loginAttemptTracker.reset(email);
            const token = user.generateJWT();
            return res.status(200).json({ token });
        }

        const statusAfterFailure = loginAttemptTracker.recordFailure(email);
        if (statusAfterFailure.locked) {
            const retryAfterSeconds = Math.max(
                1,
                Math.ceil(statusAfterFailure.retryAfterMs / 1000)
            );
            res.set('Retry-After', String(retryAfterSeconds));
            return res.status(429).json({
                message: 'Account temporarily locked after repeated failed login attempts. Try again later.'
            });
        }

        return res
            .status(401)
            .json(info || { message: 'Authentication failed.' });
    })(req, res);
};

module.exports = {
    register,
    login
};
