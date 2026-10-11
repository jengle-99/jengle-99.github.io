const User = require('../models/user');
const passport = require('passport');
const { loginAttemptTracker } = require('../security/login-attempt-tracker');
const { createAuditEntry } = require('../database/audit');
const { normalizeEmail, isValidEmail } = require('../database/constraints');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'A valid email address is required.' });
    }

    try {
        const user = new User({
            name: String(req.body.name).trim(),
            email,
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

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'A valid email address is required.' });
    }
    req.body.email = email;

    const attemptStatus = loginAttemptTracker.getStatus(email);
    if (attemptStatus.locked) {
        try {
            await createAuditEntry({
                eventType: 'login.failure',
                userIdentifier: email,
                target: `user:${email}`
            });
        } catch (auditError) {
            console.error('Audit log write failed for locked login attempt:', auditError);
            return res.status(500).json({ message: 'Login attempt could not be completed because the audit record could not be saved.' });
        }

        const retryAfterSeconds = Math.max(1, Math.ceil(attemptStatus.retryAfterMs / 1000));
        res.set('Retry-After', String(retryAfterSeconds));
        return res.status(429).json({
            message: 'Account temporarily locked after repeated failed login attempts. Try again later.'
        });
    }

    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication service error.' });
        }

        if (user) {
            try {
                await createAuditEntry({
                    eventType: 'login.success',
                    userIdentifier: user.email,
                    target: `user:${user._id}`
                });
            } catch (auditError) {
                console.error('Audit log write failed for successful login:', auditError);
                return res.status(500).json({ message: 'Login could not be completed because the audit record could not be saved.' });
            }

            loginAttemptTracker.reset(email);
            const token = user.generateJWT();
            return res.status(200).json({ token });
        }

        const statusAfterFailure = loginAttemptTracker.recordFailure(email);
        try {
            await createAuditEntry({
                eventType: 'login.failure',
                userIdentifier: email,
                target: `user:${email}`
            });
        } catch (auditError) {
            console.error('Audit log write failed for failed login:', auditError);
            return res.status(500).json({ message: 'Login attempt could not be completed because the audit record could not be saved.' });
        }

        if (statusAfterFailure.locked) {
            const retryAfterSeconds = Math.max(1, Math.ceil(statusAfterFailure.retryAfterMs / 1000));
            res.set('Retry-After', String(retryAfterSeconds));
            return res.status(429).json({
                message: 'Account temporarily locked after repeated failed login attempts. Try again later.'
            });
        }

        return res.status(401).json(info || { message: 'Authentication failed.' });
    })(req, res);
};

module.exports = {
    register,
    login
};
