const express = require('express');
const router = express.Router();
const { register, login, me, forgotPassword, verifyUserOtp, resetPassword } = require('../controllers/authController');
const { registerValidator, loginValidator, forgotPasswordValidator, verifyOtpValidator, resetPasswordValidator } = require('../validators/authValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { rateLimit } = require('../middlewares/rateLimiter');

// Rate-limit auth endpoints to mitigate brute-force attacks
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// POST /api/auth/register
router.post('/register', authLimiter, registerValidator, register);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidator, login);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, me);

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPasswordValidator, forgotPassword);

// POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, verifyOtpValidator, verifyUserOtp);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPasswordValidator, resetPassword);

module.exports = router;