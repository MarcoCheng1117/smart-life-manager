import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TaskAlt,
  Flag,
  Favorite,
  AccountBalance,
  Note,
  TrendingUp,
  TrendingDown,
  Add,
  CheckCircle,
  Schedule,
  Warning
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { backgroundColors } from '../../theme';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasks: { total: 0, completed: 0, pending: 0, overdue: 0 },
    goals: { total: 0, completed: 0, inProgress: 0 },
    health: { workouts: 0, calories: 0, streak: 0 },
    finance: { income: 0, expenses: 0, balance: 0 },
    notes: { total: 0, recent: 0 }
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  // Load dashboard data from localStorage
  const loadDashboardData = useCallback(() => {
    try {
      // Load tasks
      const tasks = JSON.parse(localStorage.getItem('smart-life-tasks') || '[]');
      const completedTasks = tasks.filter(t => t.completed).length;
      const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
      
      // Load goals
      const goals = JSON.parse(localStorage.getItem('smart-life-goals') || '[]');
      const completedGoals = goals.filter(g => g.status === 'completed').length;
      const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
      
      // Load health data
      const healthData = JSON.parse(localStorage.getItem('smart-life-health') || '[]');
      const workouts = healthData.filter(h => h.type === 'workout').length;
      const totalCalories = healthData.reduce((sum, h) => sum + (h.calories || 0), 0);
      
      // Load finance data
      const financeData = JSON.parse(localStorage.getItem('smart-life-finance') || '[]');
      const income = financeData.filter(f => f.type === 'income').reduce((sum, f) => sum + (f.amount || 0), 0);
      const expenses = financeData.filter(f => f.type === 'expense').reduce((sum, f) => sum + (f.amount || 0), 0);
      
      // Load notes
      const notes = JSON.parse(localStorage.getItem('smart-life-notes') || '[]');
      const recentNotes = notes.filter(n => {
        const noteDate = new Date(n.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate > weekAgo;
      }).length;

      setStats({
        tasks: { total: tasks.length, completed: completedTasks, pending: tasks.length - completedTasks, overdue: overdueTasks },
        goals: { total: goals.length, completed: completedGoals, inProgress: inProgressGoals },
        health: { workouts, calories: totalCalories, streak: 5 }, // Mock streak
        finance: { income, expenses, balance: income - expenses },
        notes: { total: notes.length, recent: recentNotes }
      });

      // Generate recent activity
      generateRecentActivity(tasks, goals, notes, healthData, financeData);
      
      // Generate quick actions
      generateQuickActions();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const generateRecentActivity = (tasks, goals, notes, health, finance) => {
    const activities = [];
    
    // Add recent tasks
    tasks.slice(0, 3).forEach(task => {
      activities.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.text,
        description: `Task ${task.completed ? 'completed' : 'added'}`,
        timestamp: task.createdAt,
        icon: task.completed ? <CheckCircle color="success" /> : <TaskAlt color="primary" />
      });
    });
    
    // Add recent notes
    notes.slice(0, 2).forEach(note => {
      activities.push({
        id: `note-${note.id}`,
        type: 'note',
        title: note.text.substring(0, 30) + '...',
        description: 'Note added',
        timestamp: note.createdAt,
        icon: <Note color="info" />
      });
    });
    
    // Add recent health entries
    health.slice(0, 2).forEach(entry => {
      activities.push({
        id: `health-${entry.id}`,
        type: 'health',
        title: `${entry.type} logged`,
        description: entry.description || 'Health entry added',
        timestamp: entry.createdAt,
        icon: <Favorite color="success" />
      });
    });
    
    // Sort by timestamp and take top 8
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRecentActivity(activities.slice(0, 8));
  };

  const generateQuickActions = () => {
    setQuickActions([
      { id: 1, title: 'Add Task', icon: <TaskAlt />, color: 'primary', action: 'add-task' },
      { id: 2, title: 'Log Workout', icon: <Favorite />, color: 'success', action: 'log-workout' },
      { id: 3, title: 'Add Note', icon: <Note />, color: 'info', action: 'add-note' },
      { id: 4, title: 'Set Goal', icon: <Flag />, color: 'warning', action: 'set-goal' },
      { id: 5, title: 'Log Expense', icon: <AccountBalance />, color: 'error', action: 'log-expense' },
      { id: 6, title: 'Quick Capture', icon: <Add />, color: 'secondary', action: 'quick-capture' }
    ]);
  };

  // Chart data for weekly progress
  const weeklyData = [
    { day: 'Mon', tasks: 5, goals: 2, health: 1 },
    { day: 'Tue', tasks: 3, goals: 1, health: 2 },
    { day: 'Wed', tasks: 7, goals: 3, health: 1 },
    { day: 'Thu', tasks: 4, goals: 2, health: 3 },
    { day: 'Fri', tasks: 6, goals: 1, health: 2 },
    { day: 'Sat', tasks: 2, goals: 0, health: 1 },
    { day: 'Sun', tasks: 3, goals: 1, health: 0 }
  ];

  // Pie chart data for task categories
  const taskCategoryData = [
    { name: 'Work', value: 35, color: '#8884d8' },
    { name: 'Personal', value: 25, color: '#82ca9d' },
    { name: 'Health', value: 20, color: '#ffc658' },
    { name: 'Finance', value: 20, color: '#ff7300' }
  ];

  const handleQuickAction = (action) => {
    // Navigate to appropriate section based on action
    switch (action) {
      case 'add-task':
        window.location.hash = '#/tasks';
        break;
      case 'log-workout':
        window.location.hash = '#/health';
        break;
      case 'add-note':
        window.location.hash = '#/notes';
        break;
      case 'set-goal':
        window.location.hash = '#/goals';
        break;
      case 'log-expense':
        window.location.hash = '#/finance';
        break;
      default:
        break;
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back! Here's your life overview for today.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: backgroundColors.bg1 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action) => (
            <Grid item xs={6} sm={4} md={2} key={action.id}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={() => handleQuickAction(action.action)}
                sx={{
                  height: 80,
                  flexDirection: 'column',
                  gap: 1,
                  borderColor: `${action.color}.main`,
                  color: `${action.color}.main`,
                  '&:hover': {
                    borderColor: `${action.color}.dark`,
                    backgroundColor: `${action.color}.main`,
                    color: 'white'
                  }
                }}
              >
                <Typography variant="body2">{action.title}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskAlt sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {stats.tasks.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.tasks.completed / Math.max(stats.tasks.total, 1)) * 100}
                color={getProgressColor((stats.tasks.completed / Math.max(stats.tasks.total, 1)) * 100)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.tasks.completed} completed, {stats.tasks.pending} pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Flag sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.goals.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Goals
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.goals.completed / Math.max(stats.goals.total, 1)) * 100}
                color="warning"
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.goals.completed} completed, {stats.goals.inProgress} in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Favorite sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.health.workouts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Workouts This Week
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" color="success.main">
                {stats.health.streak} day streak! 🔥
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg8 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    ${stats.finance.balance.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TrendingUp color="success" />
                <Typography variant="body2" color="success.main">
                  +${stats.finance.income.toFixed(2)}
                </Typography>
                <TrendingDown color="error" />
                <Typography variant="body2" color="error.main">
                  -${stats.finance.expenses.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Weekly Progress Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="goals" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="health" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Task Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity & Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>{activity.icon}</ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={`${activity.description} • ${new Date(activity.timestamp).toLocaleDateString()}`}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: backgroundColors.bg4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Alerts & Reminders
              </Typography>
              
              {stats.tasks.overdue > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Warning color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="error.main">
                    {stats.tasks.overdue} overdue tasks
                  </Typography>
                </Box>
              )}
              
              {stats.goals.inProgress > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Schedule color="warning" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="warning.main">
                    {stats.goals.inProgress} goals in progress
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  {stats.health.streak} day health streak!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 