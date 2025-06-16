// backend/src/routes/api/filEvenementsRoutes.js
const express = require('express');
const router = express.Router();
const filEvenementsController = require('../../controllers/filEvenementsController');
const authMiddleware = require('../../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// Create a new entry
router.post('/', filEvenementsController.createEntreeFil);

// Get all entries for a specific incident (using query parameter)
router.get('/', filEvenementsController.getEntreesFilPourIncident);

module.exports = router;
