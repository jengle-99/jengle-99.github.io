const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const { validateTripPayload } = require('../middleware/validation');

router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(
        authenticateJWT,
        authorizeRoles('admin'),
        validateTripPayload,
        tripsController.tripsAddTrip
    );

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(
        authenticateJWT,
        authorizeRoles('admin'),
        validateTripPayload,
        tripsController.tripsUpdateTrip
    );

module.exports = router;
