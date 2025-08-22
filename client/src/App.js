import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button, Avatar, Menu, MenuItem, IconButton, Paper, Grid } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  TaskAlt, 
  Flag, 
  Favorite, 
  AccountBalance,
  Note,
  Person,
  Logout,
  Menu as MenuIcon
} from '@mui/icons-material';
import './App.css';

// Import our custom theme and components
import { theme, backgroundColors } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import all components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import Notes from './components/Notes';
import TaskManager from './components/TaskManager';
import GoalsManager from './components/goals/GoalsManager';
import HealthTracker from './components/health/HealthTracker';
import FinanceTracker from './components/finance/FinanceTracker';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Authentication Pages Component
const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </Box>
  );
};

// Main App Layout Component
const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon />, color: 'primary' },
    { path: '/tasks', label: 'Tasks', icon: <TaskAlt />, color: 'warning' },
    { path: '/notes', label: 'Notes', icon: <Note />, color: 'success' },
    { path: '/goals', label: 'Goals', icon: <Flag />, color: 'secondary' },
    { path: '/health', label: 'Health', icon: <Favorite />, color: 'error' },
    { path: '/finance', label: 'Finance', icon: <AccountBalance />, color: 'info' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Smart Life Manager
          </Typography>
          
          {/* User Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Welcome, {currentUser?.firstName || 'User'}!
            </Typography>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {currentUser?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Navigation Menu */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Desktop Navigation */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {navigationItems.map((item) => (
            <a key={item.path} href={`#${item.path}`} style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={item.icon}
                sx={{
                  borderColor: `${item.color}.main`,
                  color: `${item.color}.main`,
                  '&:hover': {
                    borderColor: `${item.color}.dark`,
                    backgroundColor: `${item.color}.main`,
                    color: 'white'
                  },
                  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {item.label}
              </Button>
            </a>
          ))}
        </Box>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <Paper sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: backgroundColors.bg1,
            display: { md: 'none' }
          }}>
            <Grid container spacing={1}>
              {navigationItems.map((item) => (
                <Grid item xs={6} key={item.path}>
                  <a href={`#${item.path}`} style={{ textDecoration: 'none' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={item.icon}
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        borderColor: `${item.color}.main`,
                        color: `${item.color}.main`,
                        '&:hover': {
                          borderColor: `${item.color}.dark`,
                          backgroundColor: `${item.color}.main`,
                          color: 'white'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </a>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {/* Main Content Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/goals" element={<GoalsManager />} />
          <Route path="/health" element={<HealthTracker />} />
          <Route path="/finance" element={<FinanceTracker />} />
        </Routes>
      </Container>
    </Box>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthPages />} />
            <Route path="/register" element={<AuthPages />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 