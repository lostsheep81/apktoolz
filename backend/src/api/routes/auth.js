const express = require('express');
const { register, login, refreshToken, resetPassword } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Token refresh
router.post('/refresh-token', refreshToken);

// Password reset
router.post('/reset-password', resetPassword);

module.exports = router;