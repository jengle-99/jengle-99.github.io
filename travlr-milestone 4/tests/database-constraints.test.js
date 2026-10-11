const assert = require('assert');
const {
    TRIP_LIMITS,
    normalizeEmail,
    isValidEmail,
    isValidTripCode
} = require('../app_api/database/constraints');
const {
    makeValidTripCode,
    createUniqueTripCode
} = require('../app_api/database/migration-utils');

assert.strictEqual(normalizeEmail(' User@Example.COM '), 'user@example.com');
assert.strictEqual(isValidEmail('user@example.com'), true);
assert.strictEqual(isValidEmail('not-an-email'), false);

assert.strictEqual(isValidTripCode('TRIP-001'), true);
assert.strictEqual(isValidTripCode('TRIP 001'), false);
assert.strictEqual(isValidTripCode('A'), false);
assert.strictEqual(isValidTripCode('X'.repeat(TRIP_LIMITS.code.max + 1)), false);

assert.strictEqual(makeValidTripCode(' Trip / 001 '), 'Trip-001');
assert.strictEqual(makeValidTripCode('@@@'), 'TRIP');

const used = new Set();
assert.strictEqual(createUniqueTripCode('TRIP-001', used), 'TRIP-001');
assert.strictEqual(createUniqueTripCode('TRIP-001', used), 'TRIP-001-2');
assert.strictEqual(createUniqueTripCode('TRIP-001', used), 'TRIP-001-3');

console.log('Database constraint and migration utility tests passed.');
