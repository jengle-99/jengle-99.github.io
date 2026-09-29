const assert = require('assert');
const { LoginAttemptTracker } = require('../app_api/security/login-attempt-tracker');

const MINUTE = 60 * 1000;
let currentTime = 1_000_000;

function createTracker() {
    currentTime = 1_000_000;
    return new LoginAttemptTracker({
        maxFailures: 5,
        windowMs: 30 * MINUTE,
        lockDurationMs: 30 * MINUTE,
        now: () => currentTime
    });
}

function testDoesNotLockBeforeFiveFailures() {
    const tracker = createTracker();

    for (let i = 0; i < 4; i += 1) {
        const status = tracker.recordFailure('user@example.com');
        assert.strictEqual(status.locked, false);
        assert.strictEqual(status.failureCount, i + 1);
    }
}

function testLocksOnFifthFailureForThirtyMinutes() {
    const tracker = createTracker();

    for (let i = 0; i < 4; i += 1) {
        tracker.recordFailure('user@example.com');
    }

    const status = tracker.recordFailure('user@example.com');
    assert.strictEqual(status.locked, true);
    assert.strictEqual(status.failureCount, 5);
    assert.strictEqual(status.retryAfterMs, 30 * MINUTE);

    currentTime += 29 * MINUTE;
    assert.strictEqual(tracker.getStatus('user@example.com').locked, true);

    currentTime += 1 * MINUTE;
    const unlockedStatus = tracker.getStatus('user@example.com');
    assert.strictEqual(unlockedStatus.locked, false);
    assert.strictEqual(unlockedStatus.failureCount, 0);
}

function testOldFailuresFallOutsideSlidingWindow() {
    const tracker = createTracker();

    for (let i = 0; i < 4; i += 1) {
        tracker.recordFailure('user@example.com');
    }

    currentTime += 31 * MINUTE;
    const status = tracker.recordFailure('user@example.com');
    assert.strictEqual(status.locked, false);
    assert.strictEqual(status.failureCount, 1);
}

function testResetClearsAttemptHistory() {
    const tracker = createTracker();

    for (let i = 0; i < 4; i += 1) {
        tracker.recordFailure('user@example.com');
    }

    tracker.reset('user@example.com');
    const status = tracker.getStatus('user@example.com');
    assert.strictEqual(status.locked, false);
    assert.strictEqual(status.failureCount, 0);
}

function testEmailKeysAreNormalized() {
    const tracker = createTracker();

    tracker.recordFailure(' User@Example.COM ');
    const status = tracker.getStatus('user@example.com');
    assert.strictEqual(status.failureCount, 1);
}

testDoesNotLockBeforeFiveFailures();
testLocksOnFifthFailureForThirtyMinutes();
testOldFailuresFallOutsideSlidingWindow();
testResetClearsAttemptHistory();
testEmailKeysAreNormalized();

console.log('Login attempt tracker tests passed.');
