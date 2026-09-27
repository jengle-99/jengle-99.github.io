const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    try {
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

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Authentication service error.' });
        }

        if (user) {
            const token = user.generateJWT();
            return res.status(200).json({ token });
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
