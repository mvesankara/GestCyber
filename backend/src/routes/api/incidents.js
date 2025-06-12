// backend/src/routes/api/incidents.js
const express = require('express');
const router = express.Router();
const incidentController = require('../../controllers/incidentController');
const authMiddleware = require('../../middleware/authMiddleware'); // Assuming all incident routes are protected

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// Create a new incident
router.post('/', incidentController.createIncident);

// Get all incidents
router.get('/', incidentController.getAllIncidents);

// Get a single incident by ID
router.get('/:id', incidentController.getIncidentById);

// Update an incident (placeholder)
router.put('/:id', incidentController.updateIncident);

// Delete an incident (placeholder)
router.delete('/:id', incidentController.deleteIncident);

module.exports = router;
