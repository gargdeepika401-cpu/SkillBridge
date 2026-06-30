const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const { saveOtp, verifyOtp } = require('../utils/otpStore');
const { sendOtpEmail } = require('../utils/emailService');

// REGISTER
const register = async (req, res) => {
  try {
    // Step 1: Check if validator found errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Step 2: Get data from request body
    const { name, email, password, role } = req.body;

    // Step 3: Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Step 4: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Save user to database
    const result = await userModel.create(name, email, hashedPassword, role || 'student');

    // Step 6: Send success response
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    // Step 1: Check if validator found errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Step 2: Get data from request body
    const { email, password } = req.body;

    // Step 3: Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 4: Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 5: Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Step 6: Send token back
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CURRENT USER (requires auth middleware)
const me = async (req, res) => {
  try {
    const user = await userModel.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD — sends OTP to user's email
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await userModel.findByEmail(email);
    if (!user) {
      // Don't reveal whether email exists (prevents user enumeration)
      return res.status(200).json({ message: 'If this email is registered, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP in memory (5-min expiry)
    saveOtp(email, otp);

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'If this email is registered, an OTP has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// VERIFY OTP — checks if the OTP is correct
const verifyUserOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    // Verify the OTP (also deletes it so it can't be reused)
    const isValid = verifyOtp(email, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // OTP verified — generate a temporary reset token (another OTP stored internally)
    const resetToken = String(Math.floor(100000 + Math.random() * 900000));
    saveOtp(`reset_${email}`, resetToken);

    res.status(200).json({ message: 'OTP verified successfully.', resetToken });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD — sets a new password after OTP verification
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    // Verify the reset token
    const isValid = verifyOtp(`reset_${email}`, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please restart the process.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in database
    await userModel.updatePassword(email, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, me, forgotPassword, verifyUserOtp, resetPassword };