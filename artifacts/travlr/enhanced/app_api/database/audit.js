const { AuditLog } = require('../models/audit-log');
const { normalizeEmail } = require('./constraints');

const createAuditEntry = async ({ eventType, userIdentifier, target }) => {
    const entry = new AuditLog({
        eventType,
        userIdentifier: normalizeEmail(userIdentifier) || 'unknown',
        target: String(target || '').trim(),
        timestamp: new Date()
    });

    return entry.save();
};

module.exports = {
    createAuditEntry
};
