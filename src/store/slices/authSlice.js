import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user data and mark as authenticated
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    
    // Clear user data and mark as not authenticated
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    // Set authentication token
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user profile
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Update user preferences
    updatePreferences: (state, action) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setToken,
  setLoading,
  setError,
  clearError,
  updateProfile,
  updatePreferences,
} = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserPreferences = (state) => state.auth.user?.preferences;

// Export reducer
export default authSlice.reducer; 