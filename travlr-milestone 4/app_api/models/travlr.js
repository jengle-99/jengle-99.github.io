const mongoose = require('mongoose');
const { TRIP_LIMITS, TRIP_CODE_PATTERN } = require('../database/constraints');

const boundedString = (field, options = {}) => ({
    type: String,
    required: true,
    trim: true,
    minlength: TRIP_LIMITS[field].min,
    maxlength: TRIP_LIMITS[field].max,
    ...options
});

const tripSchema = new mongoose.Schema({
    code: boundedString('code', {
        unique: true,
        match: [TRIP_CODE_PATTERN, 'Trip code may contain only letters, numbers, and hyphens.']
    }),
    name: boundedString('name'),
    length: boundedString('length'),
    start: { type: Date, required: true },
    resort: boundedString('resort'),
    perPerson: boundedString('perPerson'),
    image: boundedString('image'),
    description: boundedString('description')
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;
