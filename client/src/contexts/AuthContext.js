import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for development (replace with real API calls)
const mockUsers = [
  {
    id: '1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: 'Demo123!', // In real app, this would be hashed
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('smart-life-token');
        const userData = localStorage.getItem('smart-life-user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('smart-life-token');
        localStorage.removeItem('smart-life-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }
      
      // Create user object without password
      const { password: _, ...userData } = user;
      
      // Generate mock token
      const token = `mock-token-${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('smart-life-token', token);
      localStorage.setItem('smart-life-user', JSON.stringify(userData));
      
      // Update state
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Add to mock users (in real app, this would go to database)
      mockUsers.push(newUser);
      
      // Generate mock token
      const token = `mock-token-${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('smart-life-token', token);
      localStorage.setItem('smart-life-user', JSON.stringify(newUser));
      
      // Update state
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('smart-life-token');
      localStorage.removeItem('smart-life-user');
      
      // Update state
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user data
      const updatedUser = { ...currentUser, ...updates };
      
      // Update in mock users (in real app, this would update database)
      const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      }
      
      // Update localStorage
      localStorage.setItem('smart-life-user', JSON.stringify(updatedUser));
      
      // Update state
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify current password (in real app, this would be hashed)
      const user = mockUsers.find(u => u.id === currentUser.id);
      if (!user || user.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password in mock users
      user.password = newPassword;
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Check if user has specific permission (for future use)
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Add permission logic here when needed
    return true;
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 