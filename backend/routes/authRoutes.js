const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// Register routes
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);

// Login routes
router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

// Profile routes
router.get('/profile', isAuthenticated, authController.getProfile);
router.post('/profile', isAuthenticated, authController.updateProfile);

module.exports = router;