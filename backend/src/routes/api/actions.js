// backend/src/routes/api/actions.js
const express = require('express');
const router = express.Router();
const actionController = require('../../controllers/actionController');
const authMiddleware = require('../../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// Create a new action
router.post('/', actionController.createAction);

// Get all actions (optionally filtered by incidentId)
router.get('/', actionController.getAllActions);

// Get a single action by ID
router.get('/:id', actionController.getActionById);

// Update an action (placeholder)
router.put('/:id', actionController.updateAction);

// Delete an action (placeholder)
router.delete('/:id', actionController.deleteAction);

module.exports = router;
