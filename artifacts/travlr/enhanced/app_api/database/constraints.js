const TRIP_LIMITS = Object.freeze({
    code: { min: 3, max: 20 },
    name: { min: 2, max: 100 },
    length: { min: 1, max: 50 },
    resort: { min: 2, max: 100 },
    perPerson: { min: 1, max: 30 },
    image: { min: 1, max: 255 },
    description: { min: 1, max: 2000 }
});

const TRIP_CODE_PATTERN = /^[A-Za-z0-9-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeTripString = (value) => String(value || '').trim();

const isValidTripCode = (code) => {
    const normalized = normalizeTripString(code);
    const limits = TRIP_LIMITS.code;
    return normalized.length >= limits.min
        && normalized.length <= limits.max
        && TRIP_CODE_PATTERN.test(normalized);
};

const isValidEmail = (email) => EMAIL_PATTERN.test(normalizeEmail(email));

module.exports = {
    TRIP_LIMITS,
    TRIP_CODE_PATTERN,
    EMAIL_PATTERN,
    normalizeEmail,
    normalizeTripString,
    isValidTripCode,
    isValidEmail
};
