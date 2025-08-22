import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/slices/authSlice';

// Create the auth context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const reduxDispatch = useDispatch();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: userData.user, token },
            });
            reduxDispatch(setUser(userData.user));
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
            reduxDispatch(clearUser());
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
          reduxDispatch(clearUser());
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, [reduxDispatch]);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: data.user, token: data.token },
        });
        reduxDispatch(setUser(data.user));
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: data.user, token: data.token },
        });
        reduxDispatch(setUser(data.user));
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    reduxDispatch(clearUser());
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
    reduxDispatch(setUser({ ...state.user, ...userData }));
  };

  // Context value
  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 