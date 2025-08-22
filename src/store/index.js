import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import goalsReducer from './slices/goalsSlice';
import healthReducer from './slices/healthSlice';
import financeReducer from './slices/financeSlice';
import uiReducer from './slices/uiSlice';

// Import API services
import { authApi } from '../services/authApi';
import { tasksApi } from '../services/tasksApi';
import { goalsApi } from '../services/goalsApi';
import { healthApi } from '../services/healthApi';
import { financeApi } from '../services/financeApi';

// Configure the store
export const store = configureStore({
  reducer: {
    // Core slices
    auth: authReducer,
    ui: uiReducer,
    
    // Feature slices
    tasks: tasksReducer,
    goals: goalsReducer,
    health: healthReducer,
    finance: financeReducer,
    
    // API services
    [authApi.reducerPath]: authApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
    [financeApi.reducerPath]: financeApi.reducer,
  },
  
  // Add middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      tasksApi.middleware,
      goalsApi.middleware,
      healthApi.middleware,
      financeApi.middleware
    ),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export store for use in components
export { store }; 