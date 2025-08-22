const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getStorage } = require('../config/database');

const router = express.Router();

// Get storage instance
const storage = getStorage();

// Validation middleware
const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Register new user
router.post('/register', validateUserRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = Array.from(storage.users.values()).find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Store user
    storage.users.set(newUser.id, newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user data (without password)
    const { password: _, ...userData } = newUser;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', validateUserLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = Array.from(storage.users.values()).find(u => u.email === email);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user data (without password)
    const { password: _, ...userData } = user;
    res.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = storage.users.get(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    const { password: _, ...userData } = user;
    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router; 