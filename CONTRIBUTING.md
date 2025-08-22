# 🤝 Contributing to Smart Life Manager

Thank you for your interest in contributing to Smart Life Manager! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### **Before You Begin**
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Install dependencies** with `npm run install:all`
4. **Start development** with `npm run dev`

### **Making Changes**
1. **Create a feature branch** from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** before submitting
4. **Commit with clear messages** using conventional commits
5. **Push and create a pull request**

## 📋 Contribution Types

### **Code Contributions**
- **Bug fixes** - Fix issues and improve reliability
- **New features** - Add functionality users need
- **Performance improvements** - Optimize existing code
- **Refactoring** - Improve code structure and readability
- **Documentation** - Update docs and add examples

### **Non-Code Contributions**
- **Bug reports** - Help identify issues
- **Feature requests** - Suggest new functionality
- **Documentation** - Improve guides and tutorials
- **Testing** - Test features and report issues
- **Design feedback** - Improve user experience

## 🛠️ Development Setup

### **Prerequisites**
- **Node.js 18+** and **npm 8+**
- **Git** for version control
- **Modern browser** for testing
- **Code editor** (VS Code recommended)

### **Local Development**
```bash
# Clone and setup
git clone https://github.com/yourusername/smart-life-manager.git
cd smart-life-manager

# Install dependencies
npm run install:all

# Start development
npm run dev

# Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### **Available Scripts**
```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only

# Building
npm run build            # Build both frontend and backend
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Testing
npm run test             # Run all tests
npm run test:client      # Run frontend tests
npm run test:server      # Run backend tests

# Code Quality
npm run lint             # Lint all code
npm run format           # Format all code
npm run security:audit   # Security audit
```

## 📁 Project Structure

### **Frontend (client/)**
```
client/src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard and charts
│   ├── goals/          # Goals management
│   ├── health/         # Health tracking
│   ├── finance/        # Finance management
│   └── ui/             # Basic UI elements
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── theme.js            # Material-UI theme
└── App.js              # Main application
```

### **Backend (server/)**
```
server/src/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── models/             # Data models
├── routes/             # API routes
├── middlewares/        # Custom middleware
├── utils/              # Utility functions
└── app.js              # Main server file
```

## 🎯 Development Guidelines

### **Code Standards**

#### **JavaScript/React**
- Use **functional components** with hooks
- Follow **React best practices** and patterns
- Use **TypeScript** for new components (optional but recommended)
- Implement **proper error handling** and loading states
- Use **semantic HTML** and accessibility features

#### **Component Structure**
```jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @returns {JSX.Element} Rendered component
 */
const ExampleComponent = ({ title }) => {
  // State and hooks
  const [data, setData] = useState(null);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <Box>
      <Typography variant="h5">{title}</Typography>
    </Box>
  );
};

export default ExampleComponent;
```

#### **File Naming**
- **Components**: PascalCase (e.g., `TaskManager.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Files**: kebab-case for multi-word (e.g., `task-form.js`)

### **State Management**
- Use **React Context** for global state (authentication, user data)
- Use **local state** for component-specific data
- Use **localStorage** for data persistence
- Consider **Redux Toolkit** for complex state (future)

### **Styling Guidelines**
- Use **Material-UI components** as primary UI elements
- Follow **custom theme** defined in `theme.js`
- Use **CSS-in-JS** with Material-UI's `sx` prop
- Maintain **responsive design** for all screen sizes
- Follow **accessibility** best practices

### **Error Handling**
```jsx
// Good error handling
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

try {
  setIsLoading(true);
  setError(null);
  const result = await apiCall();
  setData(result);
} catch (err) {
  setError(err.message || 'An error occurred');
} finally {
  setIsLoading(false);
}

// Display error state
if (error) {
  return <Alert severity="error">{error}</Alert>;
}
```

## 🧪 Testing

### **Testing Requirements**
- **Unit tests** for utility functions
- **Component tests** for React components
- **Integration tests** for feature workflows
- **Accessibility tests** for UI components

### **Running Tests**
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- TaskManager.test.js
```

### **Test Structure**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskManager from '../TaskManager';

describe('TaskManager', () => {
  test('renders task form', () => {
    render(<TaskManager />);
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
  });
  
  test('adds new task', async () => {
    render(<TaskManager />);
    const input = screen.getByLabelText(/task title/i);
    const button = screen.getByText(/add task/i);
    
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
});
```

## 📝 Documentation

### **Code Documentation**
- **JSDoc comments** for functions and components
- **Inline comments** for complex logic
- **README updates** for new features
- **API documentation** for backend endpoints

### **Component Documentation**
```jsx
/**
 * TaskManager - Manages user tasks with CRUD operations
 * 
 * Features:
 * - Add new tasks with title, description, and priority
 * - Mark tasks as complete/incomplete
 * - Filter tasks by status and priority
 * - Search tasks by text content
 * - Delete tasks with confirmation
 * 
 * @example
 * <TaskManager />
 * 
 * @returns {JSX.Element} Task management interface
 */
const TaskManager = () => {
  // Component implementation
};
```

## 🔒 Security Guidelines

### **Frontend Security**
- **Validate all inputs** before processing
- **Sanitize user data** before display
- **Use HTTPS** in production
- **Implement proper authentication** flows
- **Protect against XSS** attacks

### **Data Handling**
- **Encrypt sensitive data** in localStorage
- **Validate data formats** before storage
- **Implement proper logout** functionality
- **Clear sensitive data** on logout

## 🚀 Pull Request Process

### **Before Submitting**
1. **Test thoroughly** - Ensure all tests pass
2. **Check linting** - Run `npm run lint`
3. **Format code** - Run `npm run format`
4. **Update documentation** - Add/update relevant docs
5. **Test on different browsers** - Ensure compatibility

### **Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Screenshots
Add screenshots if UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design maintained
```

### **Review Process**
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** and make changes
4. **Final approval** and merge

## 🐛 Bug Reports

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 100, Firefox 99]
- Version: [e.g., 1.2.3]

## Additional Context
Screenshots, logs, or other relevant information
```

## 💡 Feature Requests

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you've considered

## Additional Context
Screenshots, mockups, or examples
```

## 📚 Learning Resources

### **For Contributors**
- [React Documentation](https://react.dev/)
- [Material-UI Guide](https://mui.com/material-ui/getting-started/)
- [Testing Library](https://testing-library.com/docs/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### **Project-Specific**
- Review existing components for patterns
- Check `theme.js` for styling guidelines
- Study authentication flow in `AuthContext`
- Understand data flow in components

## 🏷️ Labels and Milestones

### **Issue Labels**
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Important issues

### **Milestones**
- `v1.0.0` - Initial release
- `v1.1.0` - Feature additions
- `v1.2.0` - Performance improvements
- `v2.0.0` - Major refactoring

## 🎉 Recognition

### **Contributor Benefits**
- **Name in contributors list**
- **Contributor badge** on profile
- **Early access** to new features
- **Direct communication** with maintainers
- **Recognition** in release notes

### **Contributor Levels**
- **Bronze**: 1-5 contributions
- **Silver**: 6-20 contributions
- **Gold**: 21+ contributions
- **Platinum**: 50+ contributions

## 📞 Getting Help

### **Communication Channels**
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Comments** - Code review feedback
- **Email** - Direct contact for urgent matters

### **Community Guidelines**
- **Be respectful** and inclusive
- **Help others** when possible
- **Share knowledge** and resources
- **Follow project** coding standards
- **Ask questions** when unsure

## 📋 Contributor Checklist

Before submitting your contribution, ensure you've completed:

- [ ] **Code follows** project style guidelines
- [ ] **Tests pass** and coverage is adequate
- [ ] **Documentation** is updated
- [ ] **Linting** passes without errors
- [ ] **Code is formatted** properly
- [ ] **Security considerations** are addressed
- [ ] **Accessibility** requirements are met
- [ ] **Responsive design** is maintained
- [ ] **Cross-browser** compatibility verified
- [ ] **Performance** impact is considered

---

**Thank you for contributing to Smart Life Manager!** 🎉

Your contributions help make this project better for everyone. If you have any questions or need help getting started, don't hesitate to ask! 