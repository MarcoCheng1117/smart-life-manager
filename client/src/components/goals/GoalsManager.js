import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Flag,
  CheckCircle,
  Schedule,
  TrendingUp,
  CalendarToday,
  Category,
  Description
} from '@mui/icons-material';
import { backgroundColors } from '../../theme';

const GoalsManager = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    targetDate: '',
    milestones: '',
    status: 'in-progress'
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('smart-life-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('smart-life-goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (!formData.title.trim()) return;

    const newGoal = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      progress: 0,
      milestones: formData.milestones ? formData.milestones.split('\n').filter(m => m.trim()) : [],
      completedMilestones: []
    };

    setGoals([newGoal, ...goals]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditGoal = () => {
    if (!editingGoal || !formData.title.trim()) return;

    const updatedGoal = {
      ...editingGoal,
      ...formData,
      milestones: formData.milestones ? formData.milestones.split('\n').filter(m => m.trim()) : [],
      updatedAt: new Date().toISOString()
    };

    setGoals(goals.map(g => g.id === editingGoal.id ? updatedGoal : g));
    resetForm();
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const handleStatusChange = (goalId, newStatus) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
          progress: newStatus === 'completed' ? 100 : g.progress
        };
      }
      return g;
    }));
  };

  const handleMilestoneToggle = (goalId, milestoneIndex) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const milestone = g.milestones[milestoneIndex];
        const isCompleted = g.completedMilestones.includes(milestone);
        
        let newCompletedMilestones;
        if (isCompleted) {
          newCompletedMilestones = g.completedMilestones.filter(m => m !== milestone);
        } else {
          newCompletedMilestones = [...g.completedMilestones, milestone];
        }
        
        const progress = (newCompletedMilestones.length / g.milestones.length) * 100;
        
        return {
          ...g,
          completedMilestones: newCompletedMilestones,
          progress: Math.min(progress, 100)
        };
      }
      return g;
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
      milestones: '',
      status: 'in-progress'
    });
  };

  const openEditDialog = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate,
      milestones: goal.milestones.join('\n'),
      status: goal.status
    });
    setIsAddDialogOpen(true);
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || goal.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'primary';
      case 'personal': return 'secondary';
      case 'health': return 'success';
      case 'finance': return 'info';
      case 'education': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'on-hold': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const isOverdue = (targetDate) => {
    if (!targetDate) return false;
    return new Date(targetDate) < new Date();
  };

  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const diffTime = new Date(targetDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Goals & Progress
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Set, track, and achieve your life goals
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          size="large"
        >
          Add New Goal
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: backgroundColors.bg2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filter}
                label="Filter by Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Goals</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: backgroundColors.bg3 }}>
              <Typography variant="h6" color="primary.main">
                {goals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Goals
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Goals Grid */}
      <Grid container spacing={3}>
        {filteredGoals.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: backgroundColors.bg4 }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm || filter !== 'all' 
                  ? 'No goals match your criteria' 
                  : 'No goals yet. Set your first goal to get started!'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredGoals.map((goal) => (
            <Grid item xs={12} lg={6} key={goal.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  backgroundColor: backgroundColors.bg1,
                  border: isOverdue(goal.targetDate) ? '2px solid #C0152F' : '1px solid rgba(94, 82, 64, 0.12)',
                  transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent>
                  {/* Goal Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        {goal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {goal.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(goal)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteGoal(goal.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={goal.category}
                      color={getCategoryColor(goal.category)}
                      size="small"
                      icon={<Category />}
                    />
                    <Chip
                      label={goal.priority}
                      color={getPriorityColor(goal.priority)}
                      size="small"
                      icon={<Flag />}
                    />
                    <Chip
                      label={goal.status}
                      color={getStatusColor(goal.status)}
                      size="small"
                      icon={<Schedule />}
                    />
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={600}>
                        {Math.round(goal.progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress}
                      color={goal.progress >= 80 ? 'success' : goal.progress >= 50 ? 'warning' : 'primary'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Target Date */}
                  {goal.targetDate && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      {isOverdue(goal.targetDate) && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          Overdue by {Math.abs(getDaysRemaining(goal.targetDate))} days
                        </Alert>
                      )}
                      {!isOverdue(goal.targetDate) && getDaysRemaining(goal.targetDate) !== null && (
                        <Typography variant="body2" color="warning.main">
                          {getDaysRemaining(goal.targetDate)} days remaining
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Milestones ({goal.completedMilestones.length}/{goal.milestones.length})
                      </Typography>
                      <List dense>
                        {goal.milestones.map((milestone, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleMilestoneToggle(goal.id, index)}
                                color={goal.completedMilestones.includes(milestone) ? 'success' : 'default'}
                              >
                                {goal.completedMilestones.includes(milestone) ? <CheckCircle /> : <Schedule />}
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText
                              primary={milestone}
                              sx={{
                                textDecoration: goal.completedMilestones.includes(milestone) ? 'line-through' : 'none',
                                color: goal.completedMilestones.includes(milestone) ? 'text.secondary' : 'text.primary'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Status Actions */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {goal.status !== 'completed' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleStatusChange(goal.id, 'completed')}
                        startIcon={<CheckCircle />}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {goal.status === 'in-progress' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => handleStatusChange(goal.id, 'on-hold')}
                      >
                        Put On Hold
                      </Button>
                    )}
                    {goal.status === 'on-hold' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleStatusChange(goal.id, 'in-progress')}
                      >
                        Resume
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Goal Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingGoal(null);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Goal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Milestones (one per line)"
                value={formData.milestones}
                onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                multiline
                rows={4}
                helperText="Enter each milestone on a new line"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsAddDialogOpen(false);
            setEditingGoal(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={editingGoal ? handleEditGoal : handleAddGoal}
            variant="contained"
            disabled={!formData.title.trim()}
          >
            {editingGoal ? 'Update Goal' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalsManager; 