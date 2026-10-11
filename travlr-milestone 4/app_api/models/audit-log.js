const mongoose = require('mongoose');

const AUDIT_EVENT_TYPES = [
    'login.success',
    'login.failure',
    'trip.create',
    'trip.update'
];

const auditLogSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: AUDIT_EVENT_TYPES,
        index: false
    },
    userIdentifier: {
        type: String,
        required: true,
        trim: true,
        maxlength: 320
    },
    target: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    versionKey: false
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ eventType: 1, timestamp: -1 });

const AuditLog = mongoose.model('auditLogs', auditLogSchema);

module.exports = {
    AuditLog,
    AUDIT_EVENT_TYPES
};
