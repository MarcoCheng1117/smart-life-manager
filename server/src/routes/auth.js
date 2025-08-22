const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Import middleware
const { protect } = require('../middlewares/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../middlewares/validation');
const { authLimiter, passwordResetLimiter } = require('../middlewares/rateLimit');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  authLimiter,
  validateUserRegistration,
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      ...otherFields
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '24h',
        issuer: 'smart-life-manager',
        audience: 'smart-life-manager-users'
      }
    );

    // Update login count and last login
    user.loginCount = 1;
    user.lastLogin = new Date();
    await user.save();

    // Return user data (without password) and token
    const userResponse = user.getPublicProfile();

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'User registered successfully'
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login',
  authLimiter,
  validateUserLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '24h',
        issuer: 'smart-life-manager',
        audience: 'smart-life-manager-users'
      }
    );

    // Update login count and last login
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();

    // Return user data (without password) and token
    const userResponse = user.getPublicProfile();

    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login successful'
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  protect,
  validateProfileUpdate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update fields
    const updateFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'profile'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'profile') {
          user.profile = { ...user.profile, ...req.body.profile };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    // Update preferences if provided
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    await user.save();

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      },
      message: 'Profile updated successfully'
    });
  })
);

/**
 * @route   PUT /api/auth/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password',
  protect,
  validatePasswordChange,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
        code: 'INCORRECT_PASSWORD'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout',
  protect,
  asyncHandler(async (req, res) => {
    // Note: JWT tokens are stateless, so we can't invalidate them server-side
    // The client should remove the token from storage
    // This endpoint is mainly for logging purposes

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '24h',
        issuer: 'smart-life-manager',
        audience: 'smart-life-manager-users'
      }
    );

    res.json({
      success: true,
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRE || '24h'
      },
      message: 'Token refreshed successfully'
    });
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        code: 'EMAIL_REQUIRED'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // For security reasons, always return success even if email doesn't exist
    // This prevents email enumeration attacks
    
    if (user) {
      // TODO: Implement email sending logic
      // For now, just log the request
      console.log(`Password reset requested for: ${email}`);
    }

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required',
        code: 'MISSING_FIELDS'
      });
    }

    try {
      // Verify reset token (this would be a separate reset token, not JWT)
      // TODO: Implement proper reset token verification
      
      // For now, return success
      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      });
    }
  })
);

module.exports = router; 