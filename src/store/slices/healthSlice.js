import { createSlice } from '@reduxjs/toolkit';

// Initial state for health
const initialState = {
  workouts: [],
  meals: [],
  healthMetrics: [],
  habits: [],
  loading: false,
  error: null,
  filters: {
    dateRange: 'week',
    workoutType: 'all',
    mealType: 'all',
  },
  sortBy: 'date',
  sortOrder: 'desc',
};

// Create the health slice
const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Set all workouts
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new workout
    addWorkout: (state, action) => {
      state.workouts.push(action.payload);
    },
    
    // Update an existing workout
    updateWorkout: (state, action) => {
      const { id, updates } = action.payload;
      const workoutIndex = state.workouts.findIndex(workout => workout.id === id);
      if (workoutIndex !== -1) {
        state.workouts[workoutIndex] = { ...state.workouts[workoutIndex], ...updates };
      }
    },
    
    // Delete a workout
    deleteWorkout: (state, action) => {
      const workoutId = action.payload;
      state.workouts = state.workouts.filter(workout => workout.id !== workoutId);
    },
    
    // Set all meals
    setMeals: (state, action) => {
      state.meals = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new meal
    addMeal: (state, action) => {
      state.meals.push(action.payload);
    },
    
    // Update an existing meal
    updateMeal: (state, action) => {
      const { id, updates } = action.payload;
      const mealIndex = state.meals.findIndex(meal => meal.id === id);
      if (mealIndex !== -1) {
        state.meals[mealIndex] = { ...state.meals[mealIndex], ...updates };
      }
    },
    
    // Delete a meal
    deleteMeal: (state, action) => {
      const mealId = action.payload;
      state.meals = state.meals.filter(meal => meal.id !== mealId);
    },
    
    // Set health metrics
    setHealthMetrics: (state, action) => {
      state.healthMetrics = action.payload;
    },
    
    // Add health metric
    addHealthMetric: (state, action) => {
      state.healthMetrics.push(action.payload);
    },
    
    // Update health metric
    updateHealthMetric: (state, action) => {
      const { id, updates } = action.payload;
      const metricIndex = state.healthMetrics.findIndex(metric => metric.id === id);
      if (metricIndex !== -1) {
        state.healthMetrics[metricIndex] = { ...state.healthMetrics[metricIndex], ...updates };
      }
    },
    
    // Set habits
    setHabits: (state, action) => {
      state.habits = action.payload;
    },
    
    // Add habit
    addHabit: (state, action) => {
      state.habits.push(action.payload);
    },
    
    // Update habit
    updateHabit: (state, action) => {
      const { id, updates } = action.payload;
      const habitIndex = state.habits.findIndex(habit => habit.id === id);
      if (habitIndex !== -1) {
        state.habits[habitIndex] = { ...state.habits[habitIndex], ...updates };
      }
    },
    
    // Toggle habit completion for a specific day
    toggleHabitDay: (state, action) => {
      const { habitId, date, completed } = action.payload;
      const habit = state.habits.find(habit => habit.id === habitId);
      if (habit) {
        if (!habit.dailyLog) {
          habit.dailyLog = {};
        }
        habit.dailyLog[date] = completed;
      }
    },
    
    // Set filter values
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = {
        dateRange: 'week',
        workoutType: 'all',
        mealType: 'all',
      };
    },
    
    // Set sorting preferences
    setSorting: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order;
    },
    
    // Bulk update workouts
    bulkUpdateWorkouts: (state, action) => {
      const { workoutIds, updates } = action.payload;
      state.workouts.forEach(workout => {
        if (workoutIds.includes(workout.id)) {
          Object.assign(workout, updates);
        }
      });
    },
    
    // Bulk delete workouts
    bulkDeleteWorkouts: (state, action) => {
      const workoutIds = action.payload;
      state.workouts = state.workouts.filter(workout => !workoutIds.includes(workout.id));
    },
    
    // Calculate workout calories
    calculateWorkoutCalories: (state, action) => {
      const { workoutId, weight, duration, intensity } = action.payload;
      const workout = state.workouts.find(workout => workout.id === workoutId);
      if (workout) {
        // Basic calorie calculation (can be enhanced with more sophisticated formulas)
        const baseCalories = {
          'running': 10,
          'walking': 4,
          'cycling': 8,
          'swimming': 12,
          'weight-training': 6,
          'yoga': 3,
          'pilates': 4,
        };
        
        const intensityMultiplier = {
          'low': 0.8,
          'medium': 1.0,
          'high': 1.3,
        };
        
        const baseRate = baseCalories[workout.type] || 5;
        const multiplier = intensityMultiplier[intensity] || 1.0;
        const weightFactor = weight / 70; // Normalize to 70kg baseline
        
        workout.calories = Math.round(baseRate * duration * multiplier * weightFactor);
      }
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  setWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  setMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  setHealthMetrics,
  addHealthMetric,
  updateHealthMetric,
  setHabits,
  addHabit,
  updateHabit,
  toggleHabitDay,
  setFilter,
  clearFilters,
  setSorting,
  bulkUpdateWorkouts,
  bulkDeleteWorkouts,
  calculateWorkoutCalories,
} = healthSlice.actions;

// Export selectors
export const selectAllWorkouts = (state) => state.health.workouts;
export const selectAllMeals = (state) => state.health.meals;
export const selectHealthMetrics = (state) => state.health.healthMetrics;
export const selectHabits = (state) => state.health.habits;
export const selectHealthLoading = (state) => state.health.loading;
export const selectHealthError = (state) => state.health.error;
export const selectHealthFilters = (state) => state.health.filters;
export const selectHealthSorting = (state) => state.health.sorting;

// Selector for filtered workouts
export const selectFilteredWorkouts = (state) => {
  const { workouts, filters, sortBy, sortOrder } = state.health;
  
  let filteredWorkouts = [...workouts];
  
  // Apply date range filter
  if (filters.dateRange !== 'all') {
    const today = new Date();
    const startDate = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    filteredWorkouts = filteredWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startDate;
    });
  }
  
  // Apply workout type filter
  if (filters.workoutType !== 'all') {
    filteredWorkouts = filteredWorkouts.filter(workout => workout.type === filters.workoutType);
  }
  
  // Apply sorting
  filteredWorkouts.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'date' || sortBy === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle numeric sorting
    if (sortBy === 'duration' || sortBy === 'calories' || sortBy === 'distance') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredWorkouts;
};

// Selector for filtered meals
export const selectFilteredMeals = (state) => {
  const { meals, filters, sortBy, sortOrder } = state.health;
  
  let filteredMeals = [...meals];
  
  // Apply date range filter
  if (filters.dateRange !== 'all') {
    const today = new Date();
    const startDate = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    filteredMeals = filteredMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= startDate;
    });
  }
  
  // Apply meal type filter
  if (filters.mealType !== 'all') {
    filteredMeals = filteredMeals.filter(meal => meal.type === filters.mealType);
  }
  
  // Apply sorting
  filteredMeals.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'date' || sortBy === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle numeric sorting
    if (sortBy === 'calories' || sortBy === 'protein' || sortBy === 'carbs' || sortBy === 'fat') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredMeals;
};

// Selector for health statistics
export const selectHealthStats = (state) => {
  const { workouts, meals, habits } = state.health;
  
  // Calculate workout statistics
  const totalWorkouts = workouts.length;
  const totalWorkoutTime = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
  const avgWorkoutDuration = totalWorkouts > 0 ? totalWorkoutTime / totalWorkouts : 0;
  
  // Calculate meal statistics
  const totalMeals = meals.length;
  const totalCaloriesConsumed = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const avgCaloriesPerMeal = totalMeals > 0 ? totalCaloriesConsumed / totalMeals : 0;
  
  // Calculate habit statistics
  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.dailyLog && habit.dailyLog[today];
  }).length;
  
  // Calculate weekly averages
  const lastWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });
  
  const weeklyWorkoutTime = lastWeekWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  const weeklyCaloriesBurned = lastWeekWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
  
  return {
    workouts: {
      total: totalWorkouts,
      totalTime: totalWorkoutTime,
      totalCalories: totalCaloriesBurned,
      averageDuration: avgWorkoutDuration,
      weeklyTime: weeklyWorkoutTime,
      weeklyCalories: weeklyCaloriesBurned,
    },
    meals: {
      total: totalMeals,
      totalCalories: totalCaloriesConsumed,
      averageCalories: avgCaloriesPerMeal,
    },
    habits: {
      total: totalHabits,
      completedToday: completedHabitsToday,
      completionRate: totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0,
    },
    overall: {
      netCalories: totalCaloriesConsumed - totalCaloriesBurned,
      workoutFrequency: totalWorkouts > 0 ? totalWorkouts / Math.max(1, Math.ceil((new Date() - new Date(workouts[0]?.date || Date.now())) / (1000 * 60 * 60 * 24 * 7))) : 0,
    },
  };
};

// Export reducer
export default healthSlice.reducer; 