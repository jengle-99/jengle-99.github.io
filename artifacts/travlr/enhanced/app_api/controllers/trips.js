const Trip = require('../models/travlr');
const { createAuditEntry } = require('../database/audit');

const auditFailureResponse = (res) => res.status(500).json({
    message: 'The database change could not be completed because the audit record could not be saved.'
});

const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to retrieve trips.' });
    }
};

const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Trip.findOne({ code: req.params.tripCode }).exec();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json({ message: 'Unable to retrieve trip.' });
    }
};

const tripsAddTrip = async (req, res) => {
    let newTrip;
    try {
        newTrip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        try {
            await createAuditEntry({
                eventType: 'trip.create',
                userIdentifier: req.auth?.email || req.auth?._id || 'unknown',
                target: `trip:${newTrip.code}`
            });
        } catch (auditError) {
            console.error('Audit log write failed for trip creation:', auditError);
            try {
                await Trip.deleteOne({ _id: newTrip._id });
            } catch (rollbackError) {
                console.error('CRITICAL: trip creation rollback failed:', rollbackError);
            }
            return auditFailureResponse(res);
        }

        return res.status(201).json(newTrip);
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ message: 'Trip code already exists.' });
        }
        return res.status(400).json({ message: 'Unable to create trip.' });
    }
};

const tripsUpdateTrip = async (req, res) => {
    let originalTrip;
    try {
        originalTrip = await Trip.findOne({ code: req.params.tripCode }).lean().exec();
        if (!originalTrip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }

        const updatedTrip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();

        try {
            await createAuditEntry({
                eventType: 'trip.update',
                userIdentifier: req.auth?.email || req.auth?._id || 'unknown',
                target: `trip:${updatedTrip.code}`
            });
        } catch (auditError) {
            console.error('Audit log write failed for trip update:', auditError);
            try {
                const { _id, __v, ...restoreFields } = originalTrip;
                await Trip.updateOne({ _id }, restoreFields, { runValidators: false }).exec();
            } catch (rollbackError) {
                console.error('CRITICAL: trip update rollback failed:', rollbackError);
            }
            return auditFailureResponse(res);
        }

        return res.status(200).json(updatedTrip);
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ message: 'Trip code already exists.' });
        }
        return res.status(400).json({ message: 'Unable to update trip.' });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
