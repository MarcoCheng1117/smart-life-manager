import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Flag,
  Schedule
} from '@mui/icons-material';
import { backgroundColors } from '../theme';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('smart-life-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('smart-life-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        priority: newTaskPriority,
        category: newTaskCategory,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: null
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskCategory('personal');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

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
      default: return 'default';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
        Task Manager
      </Typography>

      {/* Add Task Form */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        backgroundColor: backgroundColors.bg1,
        border: '1px solid rgba(94, 82, 64, 0.12)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTaskPriority}
                label="Priority"
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newTaskCategory}
                label="Category"
                onChange={(e) => setNewTaskCategory(e.target.value)}
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={addTask}
              disabled={!newTask.trim()}
              startIcon={<Add />}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center',
            backgroundColor: backgroundColors.bg2,
            border: '1px solid rgba(94, 82, 64, 0.12)'
          }}>
            <Typography variant="body2" color="text.secondary">
              {pendingCount} pending, {completedCount} completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tasks List */}
      <Grid container spacing={2}>
        {filteredTasks.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: backgroundColors.bg4,
              border: '1px solid rgba(94, 82, 64, 0.12)'
            }}>
              <Typography variant="h5" color="text.secondary">
                {searchTerm || filter !== 'all' 
                  ? 'No tasks match your criteria' 
                  : 'No tasks yet. Add your first task above!'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredTasks.map((task, index) => (
            <Grid item xs={12} key={task.id}>
              <Card 
                sx={{ 
                  opacity: task.completed ? 0.7 : 1,
                  border: task.priority === 'high' ? '2px solid #C0152F' : '1px solid rgba(94, 82, 64, 0.12)',
                  backgroundColor: index % 3 === 0 ? backgroundColors.bg3 :
                                 index % 3 === 1 ? backgroundColors.bg5 :
                                 backgroundColors.bg8,
                  transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={1}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<CheckCircle color="success" />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {task.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          size="small"
                          icon={<Flag />}
                        />
                        <Chip
                          label={task.category}
                          color={getCategoryColor(task.category)}
                          size="small"
                          icon={<Schedule />}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton
                        onClick={() => deleteTask(task.id)}
                        color="error"
                        size="small"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(192, 21, 47, 0.08)',
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TaskManager; 