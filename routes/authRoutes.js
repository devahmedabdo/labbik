const express = require('express');
const router = express.Router();
const { updatePassword, login,logout, resetPassword ,changePassword } = require('../controllers/authController');
const { protect  } = require('../middlewares/authMiddleware');

// Public
router.post('/login', login);
router.post('/logout',protect, logout);

 
router.post('/reset-password',  resetPassword);
router.post('/change-password', changePassword);
router.post('/update-password', protect, updatePassword);

module.exports = router;