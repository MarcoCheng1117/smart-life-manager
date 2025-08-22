# Contributing to Smart Life Manager 🤝

Thank you for your interest in contributing to Smart Life Manager! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Contributing Guidelines](#contributing-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Documentation](#documentation)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Git** for version control
- **MongoDB** 6+ (local or cloud)
- **Docker** (optional, for containerized development)

### First Steps
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Set up** the development environment
4. **Create** a feature branch
5. **Make** your changes
6. **Test** thoroughly
7. **Submit** a pull request

## 🛠️ Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/smart-life-manager.git
cd smart-life-manager
git remote add upstream https://github.com/ORIGINAL_OWNER/smart-life-manager.git
```

### 2. Install Dependencies
```bash
# Frontend dependencies
cd client
npm install

# Backend dependencies
cd ../server
npm install
```

### 3. Environment Configuration
```bash
# Frontend
cd client
cp .env.example .env
# Edit .env with your configuration

# Backend
cd ../server
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database Setup
```bash
# Start MongoDB (local)
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 📝 Code Standards

### JavaScript/React Standards

#### General Rules
- Use **ES6+** features when possible
- Prefer **const** and **let** over **var**
- Use **arrow functions** for consistency
- Implement **proper error handling**
- Add **JSDoc comments** for complex functions

#### React Components
```jsx
// ✅ Good - Functional component with hooks
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ title, onAction }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = () => {
    onAction(state);
  };

  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default MyComponent;
```

#### File Naming
- **Components**: PascalCase (e.g., `UserProfile.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### CSS/Styling Standards

#### Material-UI (MUI) Usage
```jsx
// ✅ Good - Using MUI components and sx prop
import { Box, Button, Typography } from '@mui/material';

const StyledComponent = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      p: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2,
    }}
  >
    <Typography variant="h4" component="h1">
      Title
    </Typography>
    <Button variant="contained" color="primary">
      Action
    </Button>
  </Box>
);
```

#### Custom Styles
```jsx
// ✅ Good - Using theme-aware styling
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));
```

### Backend Standards

#### Express.js Structure
```javascript
// ✅ Good - Controller structure
const TaskController = {
  // Get all tasks
  async getAllTasks(req, res, next) {
    try {
      const tasks = await Task.find({ userId: req.user.id });
      res.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new task
  async createTask(req, res, next) {
    try {
      const taskData = {
        ...req.body,
        userId: req.user.id,
        createdAt: new Date(),
      };
      
      const task = await Task.create(taskData);
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
};
```

#### Error Handling
```javascript
// ✅ Good - Centralized error handling
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
```

## 🔧 Contributing Guidelines

### Issue Types

#### 🐛 Bug Reports
- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots or logs** if applicable

#### ✨ Feature Requests
- **Clear description** of the feature
- **Use case** and benefits
- **Mockups or examples** if applicable
- **Implementation suggestions** if you have ideas

#### 📚 Documentation
- **Clear description** of what needs documentation
- **Target audience** (developers, users, etc.)
- **Examples** of what you'd like to see

### Branch Naming Convention
```
type/description

Examples:
feature/user-authentication
bugfix/task-completion-issue
docs/api-documentation-update
style/button-component-styling
refactor/redux-store-structure
test/auth-component-tests
```

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add Google OAuth login
fix(tasks): resolve task completion bug
docs(readme): update installation instructions
style(ui): improve button component styling
refactor(store): simplify Redux slice structure
test(auth): add authentication test cases
```

#### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## 🧪 Testing

### Frontend Testing
```bash
cd client

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=TaskComponent
```

### Backend Testing
```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=auth
```

### Test Writing Guidelines

#### React Component Tests
```jsx
// ✅ Good - Comprehensive component test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import TaskForm from './TaskForm';

const renderWithProvider = (component) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('TaskForm', () => {
  it('renders form fields correctly', () => {
    renderWithProvider(<TaskForm />);
    
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('submits form with correct data', () => {
    const mockSubmit = jest.fn();
    renderWithProvider(<TaskForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: 'Test Task' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      priority: 'medium',
      dueDate: expect.any(String),
    });
  });
});
```

#### Backend API Tests
```javascript
// ✅ Good - API endpoint test
const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');
const { setupTestDB } = require('./testUtils');

describe('POST /api/tasks', () => {
  setupTestDB();

  it('should create a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      dueDate: '2024-12-31',
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .send(taskData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(taskData.title);
    
    // Verify task was saved to database
    const savedTask = await Task.findById(response.body.data._id);
    expect(savedTask).toBeTruthy();
    expect(savedTask.title).toBe(taskData.title);
  });

  it('should return 400 for invalid data', async () => {
    const invalidData = {
      title: '', // Empty title should fail validation
    };

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .send(invalidData)
      .expect(400);
  });
});
```

## 🔄 Pull Request Process

### 1. Prepare Your Changes
```bash
# Ensure you're on the main branch and up to date
git checkout main
git pull upstream main

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit them
git add .
git commit -m "feat(scope): description of changes"

# Push to your fork
git push origin feature/your-feature-name
```

### 2. Create Pull Request
1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit the PR

### 3. PR Template
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added/updated tests for this change
- [ ] All tests pass

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information that reviewers should know.
```

## 👀 Code Review

### Review Process
1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Address feedback** and make changes
4. **Final approval** and merge

### Review Guidelines

#### What Reviewers Look For
- **Code quality** and readability
- **Performance** considerations
- **Security** implications
- **Testing** coverage
- **Documentation** updates
- **Accessibility** compliance

#### Responding to Reviews
```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"

# Push updates
git push origin feature/your-feature-name

# The PR will automatically update
```

## 📖 Documentation

### Code Documentation
- **JSDoc comments** for functions and classes
- **README updates** for new features
- **API documentation** for new endpoints
- **Component stories** for UI components

### Example JSDoc
```javascript
/**
 * Creates a new task in the system
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title
 * @param {string} taskData.description - Task description
 * @param {string} taskData.priority - Task priority (low, medium, high)
 * @param {Date} taskData.dueDate - Task due date
 * @param {string} userId - ID of the user creating the task
 * @returns {Promise<Object>} The created task object
 * @throws {Error} If task creation fails
 */
const createTask = async (taskData, userId) => {
  // Implementation
};
```

## 🤝 Community Guidelines

### Communication
- **Be respectful** and inclusive
- **Use clear language** and avoid jargon
- **Provide constructive feedback**
- **Ask questions** when you need help

### Getting Help
- **Check existing issues** first
- **Search documentation** and discussions
- **Ask in discussions** section
- **Join community channels** (Discord, etc.)

### Recognition
- **Contributors** are listed in README
- **Significant contributions** get special recognition
- **All contributors** are appreciated

## 🎯 Contribution Areas

### High Priority
- **Bug fixes** and critical issues
- **Security vulnerabilities**
- **Performance improvements**
- **Accessibility enhancements**

### Medium Priority
- **New features** and enhancements
- **UI/UX improvements**
- **Documentation updates**
- **Test coverage improvements**

### Low Priority
- **Code style** improvements
- **Minor UI tweaks**
- **Documentation** formatting
- **Example** additions

## 📞 Contact & Support

### Questions?
- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and feature requests
- **Discord**: For real-time chat and support
- **Email**: For private or sensitive matters

### Maintainers
- **Project Lead**: [@username](https://github.com/username)
- **Frontend Lead**: [@username](https://github.com/username)
- **Backend Lead**: [@username](https://github.com/username)

---

**Thank you for contributing to Smart Life Manager! 🎉**

Your contributions help make this project better for everyone. Whether you're fixing a bug, adding a feature, or improving documentation, every contribution is valuable. 