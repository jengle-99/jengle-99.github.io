const {
    normalizeEmail,
    normalizeTripString,
    TRIP_CODE_PATTERN,
    TRIP_LIMITS
} = require('./constraints');

const makeValidTripCode = (code) => {
    let normalized = normalizeTripString(code)
        .replace(/[^A-Za-z0-9-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (!normalized) {
        normalized = 'TRIP';
    }

    if (normalized.length < TRIP_LIMITS.code.min) {
        normalized = normalized.padEnd(TRIP_LIMITS.code.min, '0');
    }

    return normalized.slice(0, TRIP_LIMITS.code.max);
};

const createUniqueTripCode = (candidate, usedCodes) => {
    const base = makeValidTripCode(candidate);
    let result = base;
    let suffix = 2;

    while (usedCodes.has(result)) {
        const suffixText = `-${suffix}`;
        result = `${base.slice(0, TRIP_LIMITS.code.max - suffixText.length)}${suffixText}`;
        suffix += 1;
    }

    usedCodes.add(result);
    return result;
};

module.exports = {
    normalizeEmail,
    makeValidTripCode,
    createUniqueTripCode,
    TRIP_CODE_PATTERN
};
