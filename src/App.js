import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Layout Components
import Layout from './components/layout/Layout';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Tasks from './pages/Tasks';
import Health from './pages/Health';
import Work from './pages/Work';
import Learning from './pages/Learning';
import Finance from './pages/Finance';
import Life from './pages/Life';
import Login from './pages/Login';
import Register from './pages/Register';

// Context and Hooks
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Component
function AppContent() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/health" element={<Health />} />
            <Route path="/work" element={<Work />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/life" element={<Life />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </Box>
    </Layout>
  );
}

// Root App Component with Providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 