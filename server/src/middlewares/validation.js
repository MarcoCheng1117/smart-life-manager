const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Sanitize and validate common fields
 */
const sanitizeString = (field, minLength = 1, maxLength = 200) => 
  body(field)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`)
    .escape()
    .isString()
    .withMessage(`${field} must be a string`);

const sanitizeEmail = () =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase();

const sanitizePassword = () =>
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const sanitizeObjectId = (field) =>
  param(field)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    });

const sanitizeDate = (field) =>
  body(field)
    .optional()
    .isISO8601()
    .withMessage(`${field} must be a valid date`)
    .toDate();

const sanitizeNumber = (field, min = null, max = null) => {
  let validator = body(field)
    .isNumeric()
    .withMessage(`${field} must be a number`);
  
  if (min !== null) {
    validator = validator.isFloat({ min });
  }
  if (max !== null) {
    validator = validator.isFloat({ max });
  }
  
  return validator;
};

/**
 * Validation result handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
      code: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  sanitizeEmail(),
  sanitizePassword(),
  sanitizeString('firstName', 2, 50),
  sanitizeString('lastName', 2, 50),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
  sanitizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * User profile update validation
 */
const validateProfileUpdate = [
  sanitizeString('firstName', 2, 50).optional(),
  sanitizeString('lastName', 2, 50).optional(),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters')
    .escape(),
  handleValidationErrors
];

/**
 * Password change validation
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  sanitizePassword(),
  handleValidationErrors
];

/**
 * Task validation
 */
const validateTask = [
  sanitizeString('title', 1, 200),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .escape(),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  sanitizeDate('dueDate'),
  sanitizeDate('startDate'),
  sanitizeNumber('estimatedTime', 0).optional(),
  sanitizeNumber('actualTime', 0).optional(),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .escape(),
  sanitizeNumber('progress', 0, 100).optional(),
  handleValidationErrors
];

/**
 * Goal validation
 */
const validateGoal = [
  sanitizeString('title', 1, 200),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .escape(),
  body('type')
    .optional()
    .isIn(['personal', 'professional', 'health', 'financial', 'learning'])
    .withMessage('Invalid goal type'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .escape(),
  sanitizeDate('startDate'),
  sanitizeDate('targetDate'),
  sanitizeNumber('targetValue', 0).optional(),
  sanitizeNumber('currentValue', 0).optional(),
  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .escape(),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Invalid status value'),
  sanitizeNumber('progress', 0, 100).optional(),
  handleValidationErrors
];

/**
 * Health record validation
 */
const validateHealthRecord = [
  sanitizeDate('date'),
  sanitizeNumber('weight', 0, 500).optional(), // kg
  sanitizeNumber('bodyFat', 0, 100).optional(), // percentage
  sanitizeNumber('muscleMass', 0, 200).optional(), // kg
  sanitizeNumber('hydration', 0, 100).optional(), // percentage
  body('bloodPressure.systolic')
    .optional()
    .isInt({ min: 70, max: 200 })
    .withMessage('Systolic pressure must be between 70 and 200'),
  body('bloodPressure.diastolic')
    .optional()
    .isInt({ min: 40, max: 130 })
    .withMessage('Diastolic pressure must be between 40 and 130'),
  sanitizeNumber('heartRate', 30, 220).optional(), // bpm
  sanitizeNumber('temperature', 30, 45).optional(), // celsius
  sanitizeNumber('sleepHours', 0, 24).optional(),
  body('sleepQuality')
    .optional()
    .isIn(['poor', 'fair', 'good', 'excellent'])
    .withMessage('Invalid sleep quality value'),
  body('mood')
    .optional()
    .isIn(['very-low', 'low', 'neutral', 'high', 'very-high'])
    .withMessage('Invalid mood value'),
  body('energyLevel')
    .optional()
    .isIn(['very-low', 'low', 'neutral', 'high', 'very-high'])
    .withMessage('Invalid energy level value'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .escape(),
  handleValidationErrors
];

/**
 * Financial transaction validation
 */
const validateFinancialTransaction = [
  body('type')
    .isIn(['expense', 'income'])
    .withMessage('Transaction type must be either expense or income'),
  sanitizeNumber('amount', 0.01, 1000000),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'TWD'])
    .withMessage('Invalid currency'),
  sanitizeString('description', 1, 200),
  sanitizeString('category', 1, 100),
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .escape(),
  sanitizeDate('date'),
  body('recurring.isRecurring')
    .optional()
    .isBoolean()
    .withMessage('Recurring flag must be boolean'),
  body('recurring.frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid recurring frequency'),
  sanitizeDate('recurring.endDate').optional(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .escape(),
  handleValidationErrors
];

/**
 * Pagination and filtering validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .trim()
    .escape(),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  handleValidationErrors
];

/**
 * ID parameter validation
 */
const validateId = [
  sanitizeObjectId('id'),
  handleValidationErrors
];

module.exports = {
  // Validation functions
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateTask,
  validateGoal,
  validateHealthRecord,
  validateFinancialTransaction,
  validatePagination,
  validateId,
  
  // Utility functions
  sanitizeString,
  sanitizeEmail,
  sanitizePassword,
  sanitizeObjectId,
  sanitizeDate,
  sanitizeNumber,
  handleValidationErrors
}; 