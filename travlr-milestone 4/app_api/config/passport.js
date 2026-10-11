const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const { normalizeEmail } = require('../database/constraints');
require('../models/user');
const User = mongoose.model('users');

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const email = normalizeEmail(username);
                const user = await User.findOne({ email }).exec();

                if (!user || !user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect email or password.'
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);
