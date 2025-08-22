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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Favorite,
  Restaurant,
  FitnessCenter,
  CalendarToday,
  Timer,
  LocalFireDepartment,
  Scale,
  WaterDrop
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { backgroundColors } from '../../theme';

const HealthTracker = () => {
  const [healthData, setHealthData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    type: 'workout',
    title: '',
    description: '',
    duration: '',
    calories: '',
    weight: '',
    water: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load health data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('smart-life-health');
    if (savedData) {
      setHealthData(JSON.parse(savedData));
    }
  }, []);

  // Save health data to localStorage
  useEffect(() => {
    localStorage.setItem('smart-life-health', JSON.stringify(healthData));
  }, [healthData]);

  const handleAddEntry = () => {
    if (!formData.title.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      calories: formData.calories ? parseInt(formData.calories) : 0,
      duration: formData.duration ? parseInt(formData.duration) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      water: formData.water ? parseFloat(formData.water) : 0
    };

    setHealthData([newEntry, ...healthData]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditEntry = () => {
    if (!editingEntry || !formData.title.trim()) return;

    const updatedEntry = {
      ...editingEntry,
      ...formData,
      calories: formData.calories ? parseInt(formData.calories) : 0,
      duration: formData.duration ? parseInt(formData.duration) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      water: formData.water ? parseFloat(formData.water) : 0,
      updatedAt: new Date().toISOString()
    };

    setHealthData(healthData.map(e => e.id === editingEntry.id ? updatedEntry : e));
    resetForm();
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId) => {
    setHealthData(healthData.filter(e => e.id !== entryId));
  };

  const resetForm = () => {
    setFormData({
      type: 'workout',
      title: '',
      description: '',
      duration: '',
      calories: '',
      weight: '',
      water: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const openEditDialog = (entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      title: entry.title,
      description: entry.description,
      duration: entry.duration?.toString() || '',
      calories: entry.calories?.toString() || '',
      weight: entry.weight?.toString() || '',
      water: entry.water?.toString() || '',
      date: entry.date || new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const filteredData = healthData.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || entry.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    totalWorkouts: healthData.filter(e => e.type === 'workout').length,
    totalCalories: healthData.reduce((sum, e) => sum + (e.calories || 0), 0),
    totalDuration: healthData.reduce((sum, e) => sum + (e.duration || 0), 0),
    currentWeight: healthData.filter(e => e.type === 'weight' && e.weight).slice(-1)[0]?.weight || null,
    totalWater: healthData.filter(e => e.type === 'water').reduce((sum, e) => sum + (e.water || 0), 0),
    weeklyStreak: calculateWeeklyStreak()
  };

  function calculateWeeklyStreak() {
    const workouts = healthData.filter(e => e.type === 'workout');
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasWorkout = workouts.some(w => w.date === dateStr);
      if (hasWorkout) {
        streak++;
      } else {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }

  // Chart data for weekly progress
  const weeklyData = generateWeeklyData();
  
  function generateWeeklyData() {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = healthData.filter(e => e.date === dateStr);
      const workouts = dayData.filter(e => e.type === 'workout').length;
      const calories = dayData.reduce((sum, e) => sum + (e.calories || 0), 0);
      const water = dayData.filter(e => e.type === 'water').reduce((sum, e) => sum + (e.water || 0), 0);
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        workouts,
        calories,
        water
      });
    }
    return data;
  }

  // Weight tracking data
  const weightData = healthData
    .filter(e => e.type === 'weight' && e.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: e.weight
    }));

  const getTypeColor = (type) => {
    switch (type) {
      case 'workout': return 'success';
      case 'diet': return 'warning';
      case 'weight': return 'info';
      case 'water': return 'primary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'workout': return <FitnessCenter />;
      case 'diet': return <Restaurant />;
      case 'weight': return <Scale />;
      case 'water': return <WaterDrop />;
      default: return <Favorite />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Health & Fitness Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your workouts, nutrition, and wellness journey
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          size="large"
        >
          Log Entry
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.totalWorkouts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Workouts
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" color="success.main">
                {stats.weeklyStreak} day streak! 🔥
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFireDepartment sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalCalories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calories Burned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg8 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {Math.round(stats.totalDuration / 60)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hours Exercised
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Scale sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {stats.currentWeight ? `${stats.currentWeight}kg` : '--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                </Box>
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
                  <Line type="monotone" dataKey="workouts" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="calories" stroke="#ff9800" strokeWidth={2} />
                  <Line type="monotone" dataKey="water" stroke="#2196f3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Weight Tracking
              </Typography>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#9c27b0" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No weight data yet. Start logging your weight!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: backgroundColors.bg2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filter}
                label="Filter by Type"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Entries</MenuItem>
                <MenuItem value="workout">Workouts</MenuItem>
                <MenuItem value="diet">Diet</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="water">Water</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: backgroundColors.bg3 }}>
              <Typography variant="h6" color="primary.main">
                {healthData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Entries
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Entries List */}
      <Grid container spacing={3}>
        {filteredData.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: backgroundColors.bg4 }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm || filter !== 'all' 
                  ? 'No entries match your criteria' 
                  : 'No health entries yet. Start logging your fitness journey!'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredData.map((entry) => (
            <Grid item xs={12} md={6} key={entry.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  backgroundColor: backgroundColors.bg1,
                  border: '1px solid rgba(94, 82, 64, 0.12)',
                  transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent>
                  {/* Entry Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {entry.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {entry.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(entry)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEntry(entry.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Type and Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={entry.type}
                      color={getTypeColor(entry.type)}
                      size="small"
                      icon={getTypeIcon(entry.type)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Entry Details */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    {entry.duration && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer fontSize="small" color="action" />
                        <Typography variant="body2">
                          {entry.duration} min
                        </Typography>
                      </Box>
                    )}
                    {entry.calories && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalFireDepartment fontSize="small" color="action" />
                        <Typography variant="body2">
                          {entry.calories} cal
                        </Typography>
                      </Box>
                    )}
                    {entry.weight && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Scale fontSize="small" color="action" />
                        <Typography variant="body2">
                          {entry.weight} kg
                        </Typography>
                      </Box>
                    )}
                    {entry.water && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WaterDrop fontSize="small" color="action" />
                        <Typography variant="body2">
                          {entry.water} L
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Entry Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingEntry(null);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEntry ? 'Edit Entry' : 'Log New Entry'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Entry Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Entry Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="workout">Workout</MenuItem>
                  <MenuItem value="diet">Diet</MenuItem>
                  <MenuItem value="weight">Weight</MenuItem>
                  <MenuItem value="water">Water</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
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
            {formData.type === 'workout' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Calories Burned"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </Grid>
              </>
            )}
            {formData.type === 'weight' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </Grid>
            )}
            {formData.type === 'water' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Water (L)"
                  type="number"
                  step="0.1"
                  value={formData.water}
                  onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsAddDialogOpen(false);
            setEditingEntry(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={editingEntry ? handleEditEntry : handleAddEntry}
            variant="contained"
            disabled={!formData.title.trim()}
          >
            {editingEntry ? 'Update Entry' : 'Log Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthTracker; 