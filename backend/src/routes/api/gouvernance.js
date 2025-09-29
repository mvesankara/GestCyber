const express = require('express');
const router = express.Router();
const gouvernanceController = require('../../controllers/gouvernanceController');
const authMiddleware = require('../../middleware/authMiddleware');

// Appliquer le middleware d'authentification à toutes les routes de gouvernance
router.use(authMiddleware);

// @route   GET api/gouvernance/checklist
// @desc    Récupérer toute la checklist (catégories et questions)
// @access  Private
router.get('/checklist', gouvernanceController.getChecklist);

// @route   GET api/gouvernance/answers/:incidentId
// @desc    Récupérer les réponses pour un incident
// @access  Private
router.get('/answers/:incidentId', gouvernanceController.getAnswers);

// @route   POST api/gouvernance/answers
// @desc    Soumettre ou mettre à jour une réponse
// @access  Private
router.post('/answers', gouvernanceController.submitAnswer);

module.exports = router;