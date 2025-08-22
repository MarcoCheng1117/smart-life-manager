# Database Schemas 📊

This document describes the database models and their relationships in the Smart Life Manager application.

## Overview

The application uses MongoDB with Mongoose ODM. All models include timestamps and are designed for scalability and performance.

## Core Models

### 1. User Model

**File**: `server/src/models/User.js`

#### Schema Structure
```javascript
{
  // Basic Information
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  
  // Profile
  profile: {
    avatar: String,
    bio: String,
    phone: String,
    dateOfBirth: Date,
    location: {
      city: String,
      country: String,
      timezone: String
    }
  },
  
  // Preferences
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    currency: { type: String, default: 'USD' },
    units: { type: String, default: 'metric' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, default: 'public' },
      dataSharing: { type: Boolean, default: false }
    }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  
  // Social Auth
  googleId: String,
  facebookId: String,
  
  // Timestamps
  timestamps: true
}
```

#### Indexes
- `email` (unique)
- `googleId` (sparse)
- `facebookId` (sparse)

#### Virtual Properties
- `fullName` - Concatenated first and last name
- `displayName` - Abbreviated name for display

---

### 2. Task Model

**File**: `server/src/models/Task.js`

#### Schema Structure
```javascript
{
  // Basic Information
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Status & Priority
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Time Management
  dueDate: Date,
  estimatedTime: Number, // in minutes
  actualTime: Number, // in minutes
  startDate: Date,
  completedDate: Date,
  
  // Organization
  category: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  
  // Dependencies
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  
  // Progress
  progress: { type: Number, min: 0, max: 100, default: 0 },
  notes: [{ type: String }],
  
  // Timestamps
  timestamps: true
}
```

#### Indexes
- `userId` + `status`
- `userId` + `dueDate`
- `userId` + `category`
- `project` (sparse)

---

### 3. Goal Model

**File**: `server/src/models/Goal.js`

#### Schema Structure
```javascript
{
  // Basic Information
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Goal Details
  type: {
    type: String,
    enum: ['personal', 'professional', 'health', 'financial', 'learning'],
    default: 'personal'
  },
  category: { type: String, trim: true },
  
  // Time Management
  startDate: { type: Date, default: Date.now },
  targetDate: Date,
  completedDate: Date,
  
  // Progress Tracking
  progress: { type: Number, min: 0, max: 100, default: 0 },
  milestones: [{
    title: { type: String, required: true },
    description: String,
    targetDate: Date,
    completedDate: Date,
    isCompleted: { type: Boolean, default: false }
  }],
  
  // Metrics
  targetValue: Number,
  currentValue: Number,
  unit: String, // e.g., "kg", "pages", "dollars"
  
  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  
  // Related Data
  relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  notes: [{ type: String }],
  
  // Timestamps
  timestamps: true
}
```

#### Indexes
- `userId` + `status`
- `userId` + `type`
- `userId` + `targetDate`

---

### 4. Health Model

**File**: `server/src/models/Health.js`

#### Schema Structure
```javascript
{
  // Basic Information
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  
  // Physical Metrics
  weight: Number, // in kg
  bodyFat: Number, // percentage
  muscleMass: Number, // in kg
  hydration: Number, // percentage
  
  // Vital Signs
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number, // bpm
  temperature: Number, // celsius
  
  // Sleep
  sleepHours: Number,
  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent']
  },
  
  // Mood & Energy
  mood: {
    type: String,
    enum: ['very-low', 'low', 'neutral', 'high', 'very-high']
  },
  energyLevel: {
    type: String,
    enum: ['very-low', 'low', 'neutral', 'high', 'very-high']
  },
  
  // Notes
  notes: String,
  
  // Timestamps
  timestamps: true
}
```

#### Indexes
- `userId` + `date` (unique compound)
- `userId` + `date` (for date range queries)

---

### 5. Finance Model

**File**: `server/src/models/Finance.js`

#### Schema Structure
```javascript
{
  // Basic Information
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  
  // Transaction Details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  
  // Date & Time
  date: { type: Date, default: Date.now },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    endDate: Date
  },
  
  // Additional Info
  tags: [{ type: String, trim: true }],
  notes: String,
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  
  // Timestamps
  timestamps: true
}
```

#### Indexes
- `userId` + `type` + `date`
- `userId` + `category`
- `userId` + `date` (for date range queries)

---

## Relationships

### One-to-Many Relationships
- **User → Tasks**: One user can have many tasks
- **User → Goals**: One user can have many goals
- **User → Health Records**: One user can have many health entries
- **User → Financial Records**: One user can have many financial transactions

### Many-to-Many Relationships
- **Tasks ↔ Goals**: Tasks can be related to multiple goals
- **Tasks ↔ Projects**: Tasks can belong to multiple projects

### Self-Referencing Relationships
- **Tasks**: Subtasks and dependencies
- **Goals**: Milestones within goals

---

## Data Validation

### Common Validation Rules
- **Required Fields**: Essential data must be provided
- **String Length**: Maximum lengths for text fields
- **Enum Values**: Restricted to predefined options
- **Date Ranges**: Logical date validation
- **Numeric Ranges**: Reasonable value limits

### Custom Validators
- **Email Format**: Valid email structure
- **Password Strength**: Minimum complexity requirements
- **Date Logic**: Start dates before end dates
- **Progress Range**: 0-100 percentage values

---

## Performance Optimization

### Indexing Strategy
- **Compound Indexes**: Frequently queried field combinations
- **Sparse Indexes**: For optional fields
- **Text Indexes**: For search functionality
- **TTL Indexes**: For time-based data cleanup

### Query Optimization
- **Projection**: Select only needed fields
- **Limit**: Restrict result sets
- **Aggregation**: Use MongoDB aggregation pipeline
- **Pagination**: Implement cursor-based pagination

---

## Data Migration

### Schema Evolution
- **Versioning**: Track schema changes
- **Migration Scripts**: Automated data updates
- **Backward Compatibility**: Maintain API compatibility
- **Rollback Plans**: Revert changes if needed

### Data Cleanup
- **Archiving**: Move old data to archive collections
- **TTL Indexes**: Automatic document expiration
- **Data Retention**: Compliance with data policies

---

## Security Considerations

### Data Access Control
- **User Isolation**: Users can only access their own data
- **Field-Level Security**: Sensitive fields are protected
- **Input Validation**: Prevent injection attacks
- **Output Sanitization**: Clean data before sending

### Privacy Features
- **Data Anonymization**: Remove personal identifiers
- **Consent Management**: Track user permissions
- **Audit Logging**: Record data access and changes

---

## Backup & Recovery

### Backup Strategy
- **Regular Backups**: Daily automated backups
- **Point-in-Time Recovery**: Restore to specific moments
- **Geographic Distribution**: Multiple backup locations
- **Encryption**: Secure backup storage

### Recovery Procedures
- **Testing**: Regular recovery drills
- **Documentation**: Step-by-step recovery guides
- **Monitoring**: Backup success/failure alerts

---

## Monitoring & Maintenance

### Performance Monitoring
- **Query Performance**: Slow query detection
- **Index Usage**: Monitor index effectiveness
- **Storage Growth**: Track database size
- **Connection Pool**: Monitor connection usage

### Maintenance Tasks
- **Index Rebuilding**: Optimize index performance
- **Data Compaction**: Reduce storage overhead
- **Statistics Updates**: Keep query planner current
- **Log Rotation**: Manage log file sizes

---

**Next**: [Database Relationships](./relationships.md) | [Back to Database Overview](../README.md) 