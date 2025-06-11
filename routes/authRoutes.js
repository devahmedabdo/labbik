const express = require('express');
const router = express.Router();
const { register, login, resetPassword } = require('../controllers/authController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public
router.post('/login', login);

// Admin only
router.put('/reset-password/:id', protect, adminOnly, resetPassword);

module.exports = router;