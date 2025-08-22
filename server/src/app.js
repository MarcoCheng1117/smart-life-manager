const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Trust proxy for accurate IP detection
app.set('trust proxy', 1);

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  const { getStorageStatus } = require('./config/database');
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    storage: getStorageStatus(),
    version: '1.0.0'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Life Manager API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tasks: '/api/tasks',
      goals: '/api/goals',
      health: '/api/health',
      finance: '/api/finance',
      notes: '/api/notes'
    },
    storage: 'in-memory (cookies)',
    documentation: '/api/docs'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/health', require('./routes/health'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/notes', require('./routes/notes'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app; 