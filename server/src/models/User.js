const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines the structure for user accounts in the system
 */
const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't include password in queries by default
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: '',
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say',
  },
  phone: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    default: null,
  },
  
  // Location Information
  timezone: {
    type: String,
    default: 'UTC',
  },
  country: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  
  // Preferences
  preferences: {
    language: {
      type: String,
      enum: ['en', 'zh-Hant'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      reminders: {
        type: Boolean,
        default: true,
      },
      achievements: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private',
      },
      showProgress: {
        type: Boolean,
        default: true,
      },
      allowAnalytics: {
        type: Boolean,
        default: true,
      },
    },
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  
  // Social Authentication
  googleId: {
    type: String,
    default: null,
  },
  facebookId: {
    type: String,
    default: null,
  },
  
  // Subscription and Billing
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  
  // Statistics and Metrics
  stats: {
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    goalsAchieved: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
  },
  
  // System Fields
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
  toObject: { virtuals: true },
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.username || this.fullName;
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ 'preferences.language': 1 });
userSchema.index({ 'preferences.theme': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastSeen: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update lastSeen
userSchema.pre('save', function(next) {
  if (this.isModified('lastSeen')) {
    this.lastSeen = new Date();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    displayName: this.displayName,
    avatar: this.avatar,
    bio: this.bio,
    country: this.country,
    city: this.city,
    preferences: {
      language: this.preferences.language,
      theme: this.preferences.theme,
      units: this.preferences.units,
    },
    stats: {
      tasksCompleted: this.stats.tasksCompleted,
      goalsAchieved: this.stats.goalsAchieved,
      streakDays: this.stats.streakDays,
    },
    createdAt: this.createdAt,
    lastSeen: this.lastSeen,
  };
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.stats.lastLogin = new Date();
  this.stats.loginCount += 1;
  this.lastSeen = new Date();
  this.isOnline = true;
  return this.save();
};

// Instance method to update online status
userSchema.methods.setOnlineStatus = function(status) {
  this.isOnline = status;
  if (status) {
    this.lastSeen = new Date();
  }
  return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to get user statistics
userSchema.statics.getStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        verifiedUsers: { $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] } },
        avgTasksCompleted: { $avg: '$stats.tasksCompleted' },
        avgGoalsAchieved: { $avg: '$stats.goalsAchieved' },
        avgStreakDays: { $avg: '$stats.streakDays' },
      },
    },
  ]);
};

// Export the model
module.exports = mongoose.model('User', userSchema); 