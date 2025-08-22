import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  TaskAlt, 
  Flag, 
  Favorite, 
  AccountBalance,
  Note
} from '@mui/icons-material';
import './App.css';

// Import our functional components
import Notes from './components/Notes';
import TaskManager from './components/TaskManager';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Simple components for now
const Dashboard = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
      Dashboard
    </Typography>
    
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
        <TaskAlt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6">Tasks</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your daily tasks and priorities
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
        <Flag sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
        <Typography variant="h6">Goals</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your long-term goals and progress
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
        <Favorite sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
        <Typography variant="h6">Health</Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor your health and wellness
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
        <AccountBalance sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
        <Typography variant="h6">Finance</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your finances and budget
        </Typography>
      </Box>
    </Box>
    
    <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Welcome to Smart Life Manager!</Typography>
      <Typography variant="body1" paragraph>
        This is your personal dashboard for managing tasks, goals, health, and finances. 
        Start by adding some tasks or notes to get organized!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        All your data is stored locally in your browser, so it's private and secure.
      </Typography>
    </Box>
  </Box>
);

const Goals = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Flag sx={{ mr: 2, color: 'secondary.main' }} />
      Goals
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
      Goal tracking feature coming soon! 
      <br />
      For now, use the Notes section to track your goals.
    </Typography>
  </Box>
);

const Health = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Favorite sx={{ mr: 2, color: 'success.main' }} />
      Health
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
      Health tracking feature coming soon! 
      <br />
      For now, use the Notes section to track your health metrics.
    </Typography>
  </Box>
);

const Finance = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <AccountBalance sx={{ mr: 2, color: 'info.main' }} />
      Finance
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
      Finance tracking feature coming soon! 
      <br />
      For now, use the Notes section to track your expenses and income.
    </Typography>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Smart Life Manager
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <a href="#/" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
                  <DashboardIcon sx={{ mr: 1 }} />
                  Dashboard
                </Box>
              </a>
              <a href="#/tasks" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'secondary.dark' } }}>
                  <TaskAlt sx={{ mr: 1 }} />
                  Tasks
                </Box>
              </a>
              <a href="#/notes" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'success.dark' } }}>
                  <Note sx={{ mr: 1 }} />
                  Notes
                </Box>
              </a>
              <a href="#/goals" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'warning.dark' } }}>
                  <Flag sx={{ mr: 1 }} />
                  Goals
                </Box>
              </a>
              <a href="#/health" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'error.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'error.dark' } }}>
                  <Favorite sx={{ mr: 1 }} />
                  Health
                </Box>
              </a>
              <a href="#/finance" style={{ textDecoration: 'none' }}>
                <Box sx={{ p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'info.dark' } }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  Finance
                </Box>
              </a>
            </Box>
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/health" element={<Health />} />
              <Route path="/finance" element={<Finance />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 