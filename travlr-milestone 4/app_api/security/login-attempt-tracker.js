class LoginAttemptTracker {
    constructor(options = {}) {
        this.maxFailures = options.maxFailures || 5;
        this.windowMs = options.windowMs || (30 * 60 * 1000);
        this.lockDurationMs = options.lockDurationMs || (30 * 60 * 1000);
        this.now = options.now || (() => Date.now());
        this.attempts = new Map();
    }

    normalizeIdentifier(identifier) {
        return String(identifier || '').trim().toLowerCase();
    }

    getOrCreateState(identifier) {
        const key = this.normalizeIdentifier(identifier);
        if (!this.attempts.has(key)) {
            this.attempts.set(key, {
                failedAttempts: [],
                lockedUntil: null
            });
        }
        return { key, state: this.attempts.get(key) };
    }

    removeExpiredFailures(state, currentTime) {
        const cutoff = currentTime - this.windowMs;
        state.failedAttempts = state.failedAttempts.filter(
            (timestamp) => timestamp > cutoff
        );
    }

    getStatus(identifier) {
        const key = this.normalizeIdentifier(identifier);
        if (!key || !this.attempts.has(key)) {
            return {
                locked: false,
                retryAfterMs: 0,
                failureCount: 0
            };
        }

        const currentTime = this.now();
        const state = this.attempts.get(key);

        if (state.lockedUntil) {
            if (currentTime < state.lockedUntil) {
                return {
                    locked: true,
                    retryAfterMs: state.lockedUntil - currentTime,
                    failureCount: state.failedAttempts.length
                };
            }

            // A completed lock starts the account with a clean attempt history.
            this.attempts.delete(key);
            return {
                locked: false,
                retryAfterMs: 0,
                failureCount: 0
            };
        }

        this.removeExpiredFailures(state, currentTime);

        if (state.failedAttempts.length === 0) {
            this.attempts.delete(key);
        }

        return {
            locked: false,
            retryAfterMs: 0,
            failureCount: state.failedAttempts.length
        };
    }

    recordFailure(identifier) {
        const currentTime = this.now();
        const { key, state } = this.getOrCreateState(identifier);

        this.removeExpiredFailures(state, currentTime);
        state.failedAttempts.push(currentTime);

        if (state.failedAttempts.length >= this.maxFailures) {
            state.lockedUntil = currentTime + this.lockDurationMs;
        }

        this.attempts.set(key, state);
        return this.getStatus(key);
    }

    reset(identifier) {
        const key = this.normalizeIdentifier(identifier);
        if (key) {
            this.attempts.delete(key);
        }
    }
}

const loginAttemptTracker = new LoginAttemptTracker();

module.exports = {
    LoginAttemptTracker,
    loginAttemptTracker
};
