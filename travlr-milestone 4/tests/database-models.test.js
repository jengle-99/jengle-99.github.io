const assert = require('assert');
const Trip = require('../app_api/models/travlr');
const User = require('../app_api/models/user');
const { AuditLog } = require('../app_api/models/audit-log');

const testTripValidation = async () => {
    const validTrip = new Trip({
        code: 'TRIP-001',
        name: 'Test Trip',
        length: '7 days',
        start: new Date('2026-10-01'),
        resort: 'Test Resort',
        perPerson: '$1000',
        image: 'test.jpg',
        description: 'A valid test trip.'
    });
    await validTrip.validate();

    const invalidCode = new Trip({
        ...validTrip.toObject(),
        _id: undefined,
        code: 'BAD CODE!'
    });
    await assert.rejects(() => invalidCode.validate());

    const longName = new Trip({
        ...validTrip.toObject(),
        _id: undefined,
        name: 'N'.repeat(101)
    });
    await assert.rejects(() => longName.validate());
};

const testUserNormalization = async () => {
    const user = new User({
        email: ' User@Example.COM ',
        name: ' Test User '
    });
    await user.validate();
    assert.strictEqual(user.email, 'user@example.com');
    assert.strictEqual(user.name, 'Test User');

    const invalidUser = new User({
        email: 'not-an-email',
        name: 'Test User'
    });
    await assert.rejects(() => invalidUser.validate());
};

const testAuditValidation = async () => {
    const audit = new AuditLog({
        eventType: 'trip.update',
        userIdentifier: 'admin@example.com',
        target: 'trip:TRIP-001'
    });
    await audit.validate();

    const invalidAudit = new AuditLog({
        eventType: 'password.dump',
        userIdentifier: 'admin@example.com',
        target: 'trip:TRIP-001'
    });
    await assert.rejects(() => invalidAudit.validate());
};

(async () => {
    await testTripValidation();
    await testUserNormalization();
    await testAuditValidation();
    console.log('Database model validation tests passed.');
})().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
