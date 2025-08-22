import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
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

// Import our custom theme and components
import { theme, backgroundColors } from './theme';
import Notes from './components/Notes';
import TaskManager from './components/TaskManager';

// Simple components for now
const Dashboard = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
      Dashboard
    </Typography>
    
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
      <Box sx={{ 
        p: 3, 
        border: '1px solid rgba(94, 82, 64, 0.12)', 
        borderRadius: 2, 
        textAlign: 'center',
        backgroundColor: backgroundColors.bg1,
        transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}>
        <TaskAlt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5">Tasks</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your daily tasks and priorities
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        border: '1px solid rgba(94, 82, 64, 0.12)', 
        borderRadius: 2, 
        textAlign: 'center',
        backgroundColor: backgroundColors.bg2,
        transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}>
        <Flag sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
        <Typography variant="h5">Goals</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your long-term goals and progress
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        border: '1px solid rgba(94, 82, 64, 0.12)', 
        borderRadius: 2, 
        textAlign: 'center',
        backgroundColor: backgroundColors.bg3,
        transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}>
        <Favorite sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
        <Typography variant="h5">Health</Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor your health and wellness
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        border: '1px solid rgba(94, 82, 64, 0.12)', 
        borderRadius: 2, 
        textAlign: 'center',
        backgroundColor: backgroundColors.bg8,
        transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}>
        <AccountBalance sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
        <Typography variant="h5">Finance</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your finances and budget
        </Typography>
      </Box>
    </Box>
    
    <Box sx={{ 
      mt: 4, 
      p: 3, 
      bgcolor: 'rgba(94, 82, 64, 0.08)', 
      borderRadius: 2,
      border: '1px solid rgba(94, 82, 64, 0.12)'
    }}>
      <Typography variant="h5" gutterBottom>Welcome to Smart Life Manager!</Typography>
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
    <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Flag sx={{ mr: 2, color: 'warning.main' }} />
      Goals
    </Typography>
    <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
      Goal tracking feature coming soon! 
      <br />
      For now, use the Notes section to track your goals.
    </Typography>
  </Box>
);

const Health = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Favorite sx={{ mr: 2, color: 'success.main' }} />
      Health
    </Typography>
    <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
      Health tracking feature coming soon! 
      <br />
      For now, use the Notes section to track your health metrics.
    </Typography>
  </Box>
);

const Finance = () => (
  <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <AccountBalance sx={{ mr: 2, color: 'info.main' }} />
      Finance
    </Typography>
    <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
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
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Smart Life Manager
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3, 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a href="#/" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'primary.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <DashboardIcon sx={{ fontSize: 20 }} />
                  Dashboard
                </Box>
              </a>
              <a href="#/tasks" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'warning.main', 
                  color: 'white', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'warning.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TaskAlt sx={{ fontSize: 20 }} />
                  Tasks
                </Box>
              </a>
              <a href="#/notes" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'success.main', 
                  color: 'white', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'success.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Note sx={{ fontSize: 20 }} />
                  Notes
                </Box>
              </a>
              <a href="#/goals" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'secondary.main', 
                  color: 'secondary.contrastText', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'secondary.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Flag sx={{ fontSize: 20 }} />
                  Goals
                </Box>
              </a>
              <a href="#/health" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'error.main', 
                  color: 'white', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'error.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Favorite sx={{ fontSize: 20 }} />
                  Health
                </Box>
              </a>
              <a href="#/finance" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'info.main', 
                  color: 'white', 
                  borderRadius: 1, 
                  '&:hover': { bgcolor: 'info.dark' },
                  transition: 'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AccountBalance sx={{ fontSize: 20 }} />
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