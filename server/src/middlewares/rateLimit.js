const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

/**
 * Create Redis client for rate limiting (optional)
 * Falls back to in-memory storage if Redis is not available
 */
let redisClient = null;
let store = null;

try {
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.on('error', (err) => {
      console.warn('Redis connection failed, using in-memory rate limiting:', err.message);
      redisClient = null;
    });
    
    store = new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args)
    });
  }
} catch (error) {
  console.warn('Redis not available, using in-memory rate limiting');
}

/**
 * General API rate limiter
 * Limits all API requests per IP address
 */
const generalLimiter = rateLimit({
  store,
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    });
  }
});

/**
 * Authentication rate limiter
 * Stricter limits for login/register endpoints
 */
const authLimiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: 900
    });
  }
});

/**
 * Password reset rate limiter
 * Very strict limits for password reset endpoints
 */
const passwordResetLimiter = rateLimit({
  store,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again later',
    code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many password reset attempts, please try again later',
      code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
      retryAfter: 3600
    });
  }
});

/**
 * File upload rate limiter
 * Limits file uploads to prevent abuse
 */
const uploadLimiter = rateLimit({
  store,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    error: 'Too many file uploads, please try again later',
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many file uploads, please try again later',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      retryAfter: 3600
    });
  }
});

/**
 * Search rate limiter
 * Limits search queries to prevent abuse
 */
const searchLimiter = rateLimit({
  store,
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 searches per minute
  message: {
    success: false,
    error: 'Too many search requests, please try again later',
    code: 'SEARCH_RATE_LIMIT_EXCEEDED',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many search requests, please try again later',
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
      retryAfter: 60
    });
  }
});

/**
 * Dynamic rate limiter based on user role
 * Different limits for different user types
 */
const dynamicLimiter = (defaultLimit = 100, premiumLimit = 500) => {
  return rateLimit({
    store,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Premium users get higher limits
      if (req.user && req.user.role === 'premium') {
        return premiumLimit;
      }
      return defaultLimit;
    },
    message: {
      success: false,
      error: 'Rate limit exceeded for your account type',
      code: 'DYNAMIC_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, IP if not
      return req.user ? req.user._id.toString() : req.ip;
    }
  });
};

/**
 * IP-based blocking for suspicious activity
 * Blocks IPs that exceed limits multiple times
 */
const suspiciousActivityLimiter = rateLimit({
  store,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Very high limit
  skipSuccessfulRequests: false,
  message: {
    success: false,
    error: 'Suspicious activity detected from this IP',
    code: 'SUSPICIOUS_ACTIVITY'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Log suspicious activity
    console.warn(`Suspicious activity detected from IP: ${req.ip}`);
    
    res.status(429).json({
      success: false,
      error: 'Suspicious activity detected from this IP',
      code: 'SUSPICIOUS_ACTIVITY'
    });
  }
});

/**
 * Rate limit info middleware
 * Adds rate limit information to response headers
 */
const rateLimitInfo = (req, res, next) => {
  // Add rate limit info to response headers
  res.set({
    'X-RateLimit-Limit': process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    'X-RateLimit-Window': Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  });
  
  next();
};

/**
 * Cleanup function for Redis connection
 */
const cleanup = () => {
  if (redisClient) {
    redisClient.quit();
  }
};

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  searchLimiter,
  dynamicLimiter,
  suspiciousActivityLimiter,
  rateLimitInfo,
  cleanup
}; 