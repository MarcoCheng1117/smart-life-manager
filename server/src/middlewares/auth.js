const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized, no token provided',
        code: 'NO_TOKEN'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ 
          success: false, 
          error: 'User account is deactivated',
          code: 'USER_DEACTIVATED'
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
      
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
      
      throw jwtError;
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Silently fail for optional auth
        console.warn('Optional auth failed:', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Role-based access control middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

/**
 * Owner verification middleware
 * Ensures user can only access their own resources
 */
const requireOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const Model = require(`../models/${modelName}`);
      
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }
      
      // Check if user owns the resource
      if (resource.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }
      
      req.resource = resource;
      next();
      
    } catch (error) {
      console.error('Ownership verification error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Ownership verification failed',
        code: 'OWNERSHIP_ERROR'
      });
    }
  };
};

module.exports = {
  protect,
  optionalAuth,
  requireRole,
  requireOwnership
}; 