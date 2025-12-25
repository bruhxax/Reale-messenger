const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

// Registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
