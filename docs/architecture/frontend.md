# Frontend Architecture 🎨

This document describes the frontend architecture of the Smart Life Manager application, built with React and modern web technologies.

## Overview

The frontend is a single-page application (SPA) built with React 18, using a component-based architecture with centralized state management and modern development practices.

## Technology Stack

### Core Technologies
- **React 18** - Modern React with concurrent features
- **Material-UI (MUI)** - Component library and design system
- **Redux Toolkit** - State management and RTK Query
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Development Tools
- **TypeScript** - Type safety and better DX
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **React DevTools** - Component debugging
- **Redux DevTools** - State management debugging

### Build Tools
- **Create React App** - Build configuration
- **Webpack** - Module bundling
- **Babel** - JavaScript compilation
- **PostCSS** - CSS processing

## Architecture Patterns

### 1. Component Architecture

#### Component Hierarchy
```
App
├── AuthProvider (Context)
├── Provider (Redux)
├── BrowserRouter
├── ThemeProvider (MUI)
├── LocalizationProvider
└── AppContent
    ├── Sidebar
    ├── Header
    └── Main Content Area
        ├── Dashboard
        ├── Tasks
        ├── Goals
        ├── Health
        ├── Finance
        └── Settings
```

#### Component Types
- **Presentational Components**: Pure UI components
- **Container Components**: Connected to state
- **Layout Components**: Structure and navigation
- **Page Components**: Main application views

#### Component Structure
```jsx
// Example component structure
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ExampleComponent = () => {
  // Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector(selectData);
  
  // Event handlers
  const handleAction = () => {
    // Action logic
  };
  
  // Render
  return (
    <Box>
      <Typography variant="h6">{t('example.title')}</Typography>
      {/* Component content */}
    </Box>
  );
};

export default ExampleComponent;
```

### 2. State Management

#### Redux Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  ui: {
    theme: 'light',
    language: 'en',
    sidebarOpen: true,
    notifications: [],
    loadingStates: {},
    errors: {}
  },
  tasks: {
    tasks: [],
    filters: {},
    sortBy: 'dueDate',
    sortOrder: 'asc'
  },
  goals: {
    goals: [],
    filters: {},
    sortBy: 'targetDate'
  },
  health: {
    workouts: [],
    meals: [],
    metrics: [],
    habits: []
  },
  finance: {
    expenses: [],
    income: [],
    budgets: [],
    financialGoals: []
  }
}
```

#### RTK Query Integration
```javascript
// API service example
export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});
```

### 3. Routing Architecture

#### Route Structure
```jsx
// Protected routes
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="tasks" element={<Tasks />} />
    <Route path="goals" element={<Goals />} />
    <Route path="health" element={<Health />} />
    <Route path="finance" element={<Finance />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

#### Route Protection
```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### 4. Internationalization (i18n)

#### i18n Configuration
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      'zh-Hant': { translation: zhTranslations },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

#### Translation Usage
```jsx
const { t } = useTranslation();

// Basic translation
<Typography>{t('common.welcome')}</Typography>

// With interpolation
<Typography>{t('tasks.completed', { count: completedTasks })}</Typography>

// Pluralization
<Typography>{t('tasks.item', { count: taskCount })}</Typography>
```

## File Organization

### Directory Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── ui/             # Basic UI elements
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── index.js        # Store configuration
├── services/           # API services
├── utils/              # Utility functions
├── styles/             # Global styles and themes
├── i18n/               # Internationalization
│   └── locales/        # Translation files
├── assets/             # Static assets
├── types/              # TypeScript type definitions
├── App.js              # Main application component
└── index.js            # Application entry point
```

### Component Organization
```
components/
├── common/             # Shared across features
│   ├── Button/
│   ├── Modal/
│   └── LoadingSpinner/
├── forms/              # Form-related components
│   ├── InputField/
│   ├── FormContainer/
│   └── ValidationMessage/
├── layout/             # Layout components
│   ├── Sidebar/
│   ├── Header/
│   └── Footer/
└── ui/                 # Basic UI elements
    ├── Card/
    ├── Badge/
    └── Icon/
```

## State Management Patterns

### 1. Local State
```jsx
// Component-level state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialData);

// Form handling
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### 2. Redux State
```jsx
// Dispatching actions
const dispatch = useDispatch();

const handleCreateTask = (taskData) => {
  dispatch(createTask(taskData));
};

// Selecting state
const tasks = useSelector(selectAllTasks);
const loading = useSelector(selectTasksLoading);
```

### 3. Context State
```jsx
// Authentication context
const { user, login, logout } = useAuth();

// Theme context
const { theme, toggleTheme } = useTheme();
```

## Performance Optimization

### 1. Code Splitting
```jsx
// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 2. Memoization
```jsx
// Memoized components
const ExpensiveComponent = memo(({ data }) => {
  // Component logic
});

// Memoized selectors
const selectFilteredTasks = useMemo(
  () => createSelector(
    [selectAllTasks, selectTaskFilters],
    (tasks, filters) => filterTasks(tasks, filters)
  ),
  []
);
```

### 3. Virtualization
```jsx
// For large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index]}
      </div>
    )}
  </List>
);
```

## Error Handling

### 1. Error Boundaries
```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 2. API Error Handling
```jsx
// RTK Query error handling
const { data, error, isLoading } = useGetTasksQuery();

if (error) {
  return <ErrorMessage error={error} />;
}

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 3. Form Validation
```jsx
// Form validation with error display
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title) {
    newErrors.title = 'Title is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Testing Strategy

### 1. Unit Testing
```jsx
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('renders task form', () => {
  render(<TaskForm />);
  
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});
```

### 2. Integration Testing
```jsx
// Testing component interactions
test('creates task on form submission', async () => {
  const mockCreateTask = jest.fn();
  
  render(<TaskForm onSubmit={mockCreateTask} />);
  
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'New Task' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  expect(mockCreateTask).toHaveBeenCalledWith({
    title: 'New Task'
  });
});
```

### 3. E2E Testing
```jsx
// End-to-end testing with Cypress
describe('Task Management', () => {
  it('should create a new task', () => {
    cy.visit('/tasks');
    cy.get('[data-testid="add-task-button"]').click();
    cy.get('[data-testid="task-title-input"]').type('New Task');
    cy.get('[data-testid="save-task-button"]').click();
    cy.contains('New Task').should('be.visible');
  });
});
```

## Accessibility

### 1. ARIA Labels
```jsx
// Proper labeling for screen readers
<button
  aria-label="Delete task"
  aria-describedby="task-description"
  onClick={handleDelete}
>
  <DeleteIcon />
</button>
```

### 2. Keyboard Navigation
```jsx
// Keyboard event handling
const handleKeyPress = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyPress={handleKeyPress}
  onClick={handleAction}
>
  Clickable content
</div>
```

### 3. Color Contrast
```jsx
// Theme-aware color usage
const useStyles = makeStyles((theme) => ({
  text: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
}));
```

## Security Considerations

### 1. Input Sanitization
```jsx
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

### 2. XSS Prevention
```jsx
// Avoid dangerouslySetInnerHTML
// Instead, use proper React patterns
<div>{userContent}</div>

// If HTML is needed, sanitize first
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

### 3. Authentication
```jsx
// Protect routes and components
const ProtectedComponent = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <SensitiveContent />;
};
```

## Build and Deployment

### 1. Build Process
```bash
# Development build
npm start

# Production build
npm run build

# Build analysis
npm run analyze
```

### 2. Environment Configuration
```javascript
// Environment-specific configuration
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com/api',
    debug: false,
  },
};
```

### 3. Bundle Optimization
```javascript
// Webpack optimization
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

## Monitoring and Analytics

### 1. Error Tracking
```javascript
// Error boundary with reporting
componentDidCatch(error, errorInfo) {
  // Send to error tracking service
  errorTracker.captureException(error, errorInfo);
}
```

### 2. Performance Monitoring
```javascript
// Performance metrics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 3. User Analytics
```javascript
// User interaction tracking
const trackEvent = (eventName, properties) => {
  analytics.track(eventName, {
    timestamp: Date.now(),
    ...properties,
  });
};
```

---

## Best Practices

### 1. Code Organization
- Keep components small and focused
- Use consistent naming conventions
- Group related functionality together
- Separate concerns (UI, logic, data)

### 2. Performance
- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize re-renders with proper dependencies
- Monitor bundle size and performance

### 3. Maintainability
- Write clear, descriptive component names
- Add comprehensive JSDoc comments
- Follow consistent code formatting
- Write tests for critical functionality

### 4. User Experience
- Implement proper loading states
- Handle errors gracefully
- Provide clear feedback for actions
- Ensure responsive design across devices

---

**Next**: [Backend Architecture](./backend.md) | [Back to Architecture Overview](../README.md) 