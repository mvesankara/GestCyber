const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// @route   POST api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authentifier l'utilisateur et obtenir un token
// @access  Public
router.post('/login', authController.login);

module.exports = router;