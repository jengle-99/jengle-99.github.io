const assert = require('assert');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'milestone-two-test-secret';

const { authenticateJWT, authorizeRoles } = require('../app_api/middleware/auth');
const { validateTripPayload } = require('../app_api/middleware/validation');

function createResponse() {
    return {
        statusCode: 200,
        body: undefined,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

function testAuthenticateAdminToken() {
    const token = jwt.sign(
        { email: 'admin@example.test', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    let nextCalled = false;

    authenticateJWT(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.auth.role, 'admin');
}

function testRejectMissingToken() {
    const req = { headers: {} };
    const res = createResponse();
    let nextCalled = false;

    authenticateJWT(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 401);
}

function testRejectNonAdminRole() {
    const req = { auth: { role: 'user' } };
    const res = createResponse();
    let nextCalled = false;

    authorizeRoles('admin')(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 403);
}

function testTripValidation() {
    const validTrip = {
        code: 'TEST001',
        name: 'Test Trip',
        length: '7 days',
        start: '2026-10-01',
        resort: 'Test Resort',
        perPerson: '1000',
        image: 'test.jpg',
        description: 'Test description'
    };

    let req = { body: validTrip };
    let res = createResponse();
    let nextCalled = false;
    validateTripPayload(req, res, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);

    req = { body: { ...validTrip, start: 'not-a-date' } };
    res = createResponse();
    nextCalled = false;
    validateTripPayload(req, res, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 400);
}

testAuthenticateAdminToken();
testRejectMissingToken();
testRejectNonAdminRole();
testTripValidation();

console.log('Security middleware tests passed.');
