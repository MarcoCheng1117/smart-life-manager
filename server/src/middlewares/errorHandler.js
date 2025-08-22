/**
 * Global error handling middleware
 * Prevents information leakage and provides consistent error responses
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (but don't expose to client)
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404, code: 'INVALID_ID' };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400, code: 'DUPLICATE_FIELD', field };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation failed';
    const details = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    error = { message, statusCode: 400, code: 'VALIDATION_ERROR', details };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401, code: 'INVALID_TOKEN' };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401, code: 'TOKEN_EXPIRED' };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = { message, statusCode: 400, code: 'FILE_TOO_LARGE' };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = { message, statusCode: 400, code: 'UNEXPECTED_FILE' };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests';
    error = { message, statusCode: 429, code: 'RATE_LIMIT_EXCEEDED' };
  }

  // Network errors
  if (err.code === 'ECONNREFUSED') {
    const message = 'Service temporarily unavailable';
    error = { message, statusCode: 503, code: 'SERVICE_UNAVAILABLE' };
  }

  if (err.code === 'ETIMEDOUT') {
    const message = 'Request timeout';
    error = { message, statusCode: 408, code: 'REQUEST_TIMEOUT' };
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    success: false,
    error: message,
    code: error.code || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack }),
    ...(isDevelopment && { details: error.details }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add additional fields for specific error types
  if (error.field) {
    errorResponse.field = error.field;
  }

  if (error.details && Array.isArray(error.details)) {
    errorResponse.details = error.details;
  }

  // Set appropriate status code
  res.status(statusCode);

  // Send error response
  res.json(errorResponse);
};

/**
 * Async error wrapper
 * Eliminates need for try-catch blocks in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not found middleware
 * Handles 404 errors for undefined routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Method not allowed middleware
 * Handles 405 errors for unsupported HTTP methods
 */
const methodNotAllowed = (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED',
    path: req.originalUrl,
    method: req.method,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    timestamp: new Date().toISOString()
  });
};

/**
 * Request timeout middleware
 * Handles requests that take too long
 */
const timeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      res.status(408).json({
        success: false,
        error: 'Request timeout',
        code: 'REQUEST_TIMEOUT',
        timeout: timeoutMs,
        timestamp: new Date().toISOString()
      });
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};

/**
 * Request size limit middleware
 * Prevents oversized requests
 */
const requestSizeLimit = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const maxSizeBytes = parseSize(maxSize);

    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        error: 'Request entity too large',
        code: 'REQUEST_TOO_LARGE',
        maxSize,
        actualSize: formatBytes(contentLength),
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Parse size string to bytes
 */
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 1024 * 1024; // Default to 1MB

  const [, value, unit] = match;
  return parseFloat(value) * units[unit];
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
  methodNotAllowed,
  timeout,
  requestSizeLimit
}; 