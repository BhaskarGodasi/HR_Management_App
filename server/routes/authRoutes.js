// routes/authRoutes.js
const express = require('express');
const { register, login, getUserProfile, updatePassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile);

router.post('/update-password', protect, updatePassword);

// Admin only routes
router.post('/register', register);

module.exports = router;