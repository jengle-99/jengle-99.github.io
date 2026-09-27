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
