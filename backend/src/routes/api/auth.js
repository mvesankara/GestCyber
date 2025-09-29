// backend/src/routes/api/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const authMiddleware = require('../../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get current logged-in user's details
// @access  Private (requires token)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;