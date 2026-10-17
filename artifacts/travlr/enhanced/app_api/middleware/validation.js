const {
    TRIP_LIMITS,
    TRIP_CODE_PATTERN,
    normalizeTripString
} = require('../database/constraints');

const TRIP_FIELDS = [
    'code',
    'name',
    'length',
    'start',
    'resort',
    'perPerson',
    'image',
    'description'
];

const validateTripPayload = (req, res, next) => {
    const errors = [];

    for (const field of TRIP_FIELDS) {
        const value = req.body[field];
        if (value === undefined || value === null || String(value).trim() === '') {
            errors.push(`${field} is required.`);
        }
    }

    for (const [field, limits] of Object.entries(TRIP_LIMITS)) {
        if (req.body[field] !== undefined && req.body[field] !== null) {
            const normalized = normalizeTripString(req.body[field]);
            req.body[field] = normalized;

            if (normalized.length < limits.min || normalized.length > limits.max) {
                errors.push(`${field} must be between ${limits.min} and ${limits.max} characters.`);
            }
        }
    }

    if (req.body.code && !TRIP_CODE_PATTERN.test(req.body.code)) {
        errors.push('code may contain only letters, numbers, and hyphens.');
    }

    if (req.body.start && Number.isNaN(Date.parse(req.body.start))) {
        errors.push('start must be a valid date.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Trip validation failed.',
            errors
        });
    }

    return next();
};

module.exports = {
    validateTripPayload
};
