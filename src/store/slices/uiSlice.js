import { createSlice } from '@reduxjs/toolkit';

// Initial state for UI
const initialState = {
  // Theme settings
  theme: localStorage.getItem('theme') || 'light',
  
  // Language settings
  language: localStorage.getItem('language') || 'en',
  
  // Sidebar state
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Modal states
  modals: {
    taskModal: false,
    goalModal: false,
    workoutModal: false,
    expenseModal: false,
    noteModal: false,
  },
  
  // Notification settings
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
  
  // Loading states for different sections
  loadingStates: {
    dashboard: false,
    tasks: false,
    goals: false,
    health: false,
    finance: false,
  },
  
  // Error states
  errors: {},
  
  // Success messages
  successMessages: {},
  
  // Pagination settings
  pagination: {
    page: 1,
    pageSize: 10,
  },
  
  // Search and filter states
  search: {
    query: '',
    active: false,
  },
  
  // View preferences
  viewPreferences: {
    taskView: 'list', // 'list', 'kanban', 'calendar'
    goalView: 'cards', // 'cards', 'list', 'timeline'
    healthView: 'charts', // 'charts', 'list', 'calendar'
    financeView: 'charts', // 'charts', 'list', 'budget'
  },
};

// Create the UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Language actions
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Modal actions
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Notification actions
    setNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    
    // Loading state actions
    setLoadingState: (state, action) => {
      const { section, loading } = action.payload;
      if (state.loadingStates.hasOwnProperty(section)) {
        state.loadingStates[section] = loading;
      }
    },
    
    setAllLoadingStates: (state, action) => {
      state.loadingStates = { ...state.loadingStates, ...action.payload };
    },
    
    // Error actions
    setError: (state, action) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },
    
    clearError: (state, action) => {
      const key = action.payload;
      if (key) {
        delete state.errors[key];
      } else {
        state.errors = {};
      }
    },
    
    // Success message actions
    setSuccessMessage: (state, action) => {
      const { key, message } = action.payload;
      state.successMessages[key] = message;
    },
    
    clearSuccessMessage: (state, action) => {
      const key = action.payload;
      if (key) {
        delete state.successMessages[key];
      } else {
        state.successMessages = {};
      }
    },
    
    // Pagination actions
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page when changing page size
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    
    setSearchActive: (state, action) => {
      state.search.active = action.payload;
    },
    
    clearSearch: (state) => {
      state.search.query = '';
      state.search.active = false;
    },
    
    // View preference actions
    setViewPreference: (state, action) => {
      const { section, view } = action.payload;
      if (state.viewPreferences.hasOwnProperty(section)) {
        state.viewPreferences[section] = view;
      }
    },
    
    // Reset all UI state
    resetUI: (state) => {
      // Keep theme and language preferences
      const { theme, language } = state;
      Object.assign(state, initialState);
      state.theme = theme;
      state.language = language;
    },
    
    // Initialize UI from stored preferences
    initializeUI: (state, action) => {
      const preferences = action.payload;
      if (preferences.theme) {
        state.theme = preferences.theme;
      }
      if (preferences.language) {
        state.language = preferences.language;
      }
      if (preferences.notifications) {
        state.notifications = { ...state.notifications, ...preferences.notifications };
      }
      if (preferences.viewPreferences) {
        state.viewPreferences = { ...state.viewPreferences, ...preferences.viewPreferences };
      }
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  openModal,
  closeModal,
  closeAllModals,
  setNotificationSettings,
  setLoadingState,
  setAllLoadingStates,
  setError,
  clearError,
  setSuccessMessage,
  clearSuccessMessage,
  setPage,
  setPageSize,
  setSearchQuery,
  setSearchActive,
  clearSearch,
  setViewPreference,
  resetUI,
  initializeUI,
} = uiSlice.actions;

// Export selectors
export const selectTheme = (state) => state.ui.theme;
export const selectLanguage = (state) => state.ui.language;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectModals = (state) => state.ui.modals;
export const selectModalOpen = (state, modalName) => state.ui.modals[modalName];
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoadingStates = (state) => state.ui.loadingStates;
export const selectSectionLoading = (state, section) => state.ui.loadingStates[section];
export const selectErrors = (state) => state.ui.errors;
export const selectError = (state, key) => state.ui.errors[key];
export const selectSuccessMessages = (state) => state.ui.successMessages;
export const selectSuccessMessage = (state, key) => state.ui.successMessages[key];
export const selectPagination = (state) => state.ui.pagination;
export const selectSearch = (state) => state.ui.search;
export const selectViewPreferences = (state) => state.ui.viewPreferences;
export const selectViewPreference = (state, section) => state.ui.viewPreferences[section];

// Export reducer
export default uiSlice.reducer; 