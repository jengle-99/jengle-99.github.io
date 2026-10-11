require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../app_api/models/user');
const Trip = require('../app_api/models/travlr');
const { normalizeEmail, createUniqueTripCode } = require('../app_api/database/migration-utils');
const { isValidEmail } = require('../app_api/database/constraints');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const applyChanges = process.argv.includes('--apply');

const run = async () => {
    await mongoose.connect(dbURI);

    const users = await User.find({}).sort({ _id: 1 }).exec();
    const normalizedOwners = new Map();
    const emailUpdates = [];
    const emailConflicts = [];
    const invalidEmails = [];

    for (const user of users) {
        const normalized = normalizeEmail(user.email);
        if (!isValidEmail(normalized)) {
            invalidEmails.push({ userId: String(user._id), email: user.email });
            continue;
        }

        const existingOwner = normalizedOwners.get(normalized);
        if (existingOwner && String(existingOwner._id) !== String(user._id)) {
            emailConflicts.push({
                normalizedEmail: normalized,
                userIds: [String(existingOwner._id), String(user._id)]
            });
            continue;
        }

        normalizedOwners.set(normalized, user);
        if (user.email !== normalized) {
            emailUpdates.push({ user, normalized });
        }
    }

    const trips = await Trip.find({}).sort({ _id: 1 }).exec();
    const usedCodes = new Set();
    const tripUpdates = [];

    for (const trip of trips) {
        const uniqueCode = createUniqueTripCode(trip.code, usedCodes);
        if (trip.code !== uniqueCode) {
            tripUpdates.push({ trip, uniqueCode });
        }
    }

    console.log(`Mode: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);
    console.log(`User emails to normalize: ${emailUpdates.length}`);
    console.log(`Email conflicts requiring manual review: ${emailConflicts.length}`);
    console.log(`Invalid emails requiring manual review: ${invalidEmails.length}`);
    console.log(`Trip codes to normalize or de-duplicate: ${tripUpdates.length}`);

    for (const conflict of emailConflicts) {
        console.warn('Email conflict:', conflict);
    }
    for (const invalid of invalidEmails) {
        console.warn('Invalid email:', invalid);
    }

    if (applyChanges) {
        for (const { user, normalized } of emailUpdates) {
            // Do not update an email if another existing record normalizes to the same value.
            if (!emailConflicts.some((c) => c.normalizedEmail === normalized)) {
                await User.updateOne({ _id: user._id }, { $set: { email: normalized } }).exec();
            }
        }

        for (const { trip, uniqueCode } of tripUpdates) {
            await Trip.updateOne({ _id: trip._id }, { $set: { code: uniqueCode } }, { runValidators: false }).exec();
        }

        await User.syncIndexes();
        await Trip.syncIndexes();
        console.log('Normalization complete and indexes synchronized.');
    } else {
        console.log('No database records were changed. Run again with --apply to apply safe automatic fixes.');
    }
};

run()
    .catch((err) => {
        console.error('Migration failed:', err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
