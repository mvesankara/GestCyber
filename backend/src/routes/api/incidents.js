const express = require('express');
const router = express.Router();
const incidentController = require('../../controllers/incidentController');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// @route   POST api/incidents
// @desc    Créer un nouvel incident
// @access  Private
router.post('/', incidentController.createIncident);

// @route   GET api/incidents
// @desc    Obtenir tous les incidents
// @access  Private
router.get('/', incidentController.getAllIncidents);

module.exports = router;