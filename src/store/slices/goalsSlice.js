import { createSlice } from '@reduxjs/toolkit';

// Initial state for goals
const initialState = {
  goals: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'all',
    timeframe: 'all',
  },
  sortBy: 'deadline',
  sortOrder: 'asc',
};

// Create the goals slice
const goalsSlice = createSlice({
  name: 'goals',
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
    
    // Set all goals
    setGoals: (state, action) => {
      state.goals = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new goal
    addGoal: (state, action) => {
      state.goals.push(action.payload);
    },
    
    // Update an existing goal
    updateGoal: (state, action) => {
      const { id, updates } = action.payload;
      const goalIndex = state.goals.findIndex(goal => goal.id === id);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      }
    },
    
    // Delete a goal
    deleteGoal: (state, action) => {
      const goalId = action.payload;
      state.goals = state.goals.filter(goal => goal.id !== goalId);
    },
    
    // Update goal progress
    updateGoalProgress: (state, action) => {
      const { id, progress } = action.payload;
      const goal = state.goals.find(goal => goal.id === id);
      if (goal) {
        goal.progress = Math.min(100, Math.max(0, progress));
        goal.updatedAt = new Date().toISOString();
        
        // Check if goal is completed
        if (goal.progress >= 100 && !goal.completed) {
          goal.completed = true;
          goal.completedAt = new Date().toISOString();
        } else if (goal.progress < 100 && goal.completed) {
          goal.completed = false;
          goal.completedAt = null;
        }
      }
    },
    
    // Add milestone to goal
    addMilestone: (state, action) => {
      const { goalId, milestone } = action.payload;
      const goal = state.goals.find(goal => goal.id === goalId);
      if (goal) {
        if (!goal.milestones) {
          goal.milestones = [];
        }
        goal.milestones.push({
          id: Date.now(),
          text: milestone,
          completed: false,
          createdAt: new Date().toISOString(),
        });
      }
    },
    
    // Update milestone
    updateMilestone: (state, action) => {
      const { goalId, milestoneId, updates } = action.payload;
      const goal = state.goals.find(goal => goal.id === goalId);
      if (goal && goal.milestones) {
        const milestoneIndex = goal.milestones.findIndex(m => m.id === milestoneId);
        if (milestoneIndex !== -1) {
          goal.milestones[milestoneIndex] = { 
            ...goal.milestones[milestoneIndex], 
            ...updates 
          };
        }
      }
    },
    
    // Delete milestone
    deleteMilestone: (state, action) => {
      const { goalId, milestoneId } = action.payload;
      const goal = state.goals.find(goal => goal.id === goalId);
      if (goal && goal.milestones) {
        goal.milestones = goal.milestones.filter(m => m.id !== milestoneId);
      }
    },
    
    // Toggle milestone completion
    toggleMilestone: (state, action) => {
      const { goalId, milestoneId } = action.payload;
      const goal = state.goals.find(goal => goal.id === goalId);
      if (goal && goal.milestones) {
        const milestone = goal.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.completed = !milestone.completed;
          milestone.completedAt = milestone.completed ? new Date().toISOString() : null;
        }
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
        category: 'all',
        status: 'all',
        timeframe: 'all',
      };
    },
    
    // Set sorting preferences
    setSorting: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order;
    },
    
    // Bulk update goals (for batch operations)
    bulkUpdateGoals: (state, action) => {
      const { goalIds, updates } = action.payload;
      state.goals.forEach(goal => {
        if (goalIds.includes(goal.id)) {
          Object.assign(goal, updates);
        }
      });
    },
    
    // Bulk delete goals
    bulkDeleteGoals: (state, action) => {
      const goalIds = action.payload;
      state.goals = state.goals.filter(goal => !goalIds.includes(goal.id));
    },
    
    // Archive completed goals
    archiveCompletedGoals: (state) => {
      state.goals.forEach(goal => {
        if (goal.completed && !goal.archived) {
          goal.archived = true;
          goal.archivedAt = new Date().toISOString();
        }
      });
    },
    
    // Restore archived goal
    restoreGoal: (state, action) => {
      const goalId = action.payload;
      const goal = state.goals.find(goal => goal.id === goalId);
      if (goal) {
        goal.archived = false;
        goal.archivedAt = null;
      }
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  setGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  toggleMilestone,
  setFilter,
  clearFilters,
  setSorting,
  bulkUpdateGoals,
  bulkDeleteGoals,
  archiveCompletedGoals,
  restoreGoal,
} = goalsSlice.actions;

// Export selectors
export const selectAllGoals = (state) => state.goals.goals;
export const selectGoalsLoading = (state) => state.goals.loading;
export const selectGoalsError = (state) => state.goals.error;
export const selectGoalsFilters = (state) => state.goals.filters;
export const selectGoalsSorting = (state) => state.goals.sorting;

// Selector for filtered and sorted goals
export const selectFilteredGoals = (state) => {
  const { goals, filters, sortBy, sortOrder } = state.goals;
  
  let filteredGoals = [...goals];
  
  // Apply filters
  if (filters.category !== 'all') {
    filteredGoals = filteredGoals.filter(goal => goal.category === filters.category);
  }
  
  if (filters.status !== 'all') {
    switch (filters.status) {
      case 'active':
        filteredGoals = filteredGoals.filter(goal => !goal.completed && !goal.archived);
        break;
      case 'completed':
        filteredGoals = filteredGoals.filter(goal => goal.completed && !goal.archived);
        break;
      case 'archived':
        filteredGoals = filteredGoals.filter(goal => goal.archived);
        break;
      default:
        break;
    }
  }
  
  if (filters.timeframe !== 'all') {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    
    switch (filters.timeframe) {
      case 'this-month':
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filteredGoals = filteredGoals.filter(goal => {
          const deadline = new Date(goal.deadline);
          return deadline <= endOfMonth;
        });
        break;
      case 'this-quarter':
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
        filteredGoals = filteredGoals.filter(goal => {
          const deadline = new Date(goal.deadline);
          return deadline >= quarterStart && deadline <= quarterEnd;
        });
        break;
      case 'this-year':
        filteredGoals = filteredGoals.filter(goal => {
          const deadline = new Date(goal.deadline);
          return deadline <= endOfYear;
        });
        break;
      case 'overdue':
        filteredGoals = filteredGoals.filter(goal => {
          const deadline = new Date(goal.deadline);
          return deadline < today && !goal.completed;
        });
        break;
      default:
        break;
    }
  }
  
  // Apply sorting
  filteredGoals.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'deadline' || sortBy === 'createdAt' || sortBy === 'completedAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle progress sorting
    if (sortBy === 'progress') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredGoals;
};

// Selector for goal statistics
export const selectGoalStats = (state) => {
  const goals = state.goals.goals;
  
  return {
    total: goals.length,
    active: goals.filter(goal => !goal.completed && !goal.archived).length,
    completed: goals.filter(goal => goal.completed && !goal.archived).length,
    archived: goals.filter(goal => goal.archived).length,
    overdue: goals.filter(goal => {
      const deadline = new Date(goal.deadline);
      const today = new Date();
      return deadline < today && !goal.completed;
    }).length,
    onTrack: goals.filter(goal => {
      if (goal.completed || goal.archived) return false;
      const deadline = new Date(goal.deadline);
      const today = new Date();
      const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      const progressNeeded = (100 - goal.progress) / Math.max(1, daysRemaining);
      return progressNeeded <= 1; // Can complete on time
    }).length,
    atRisk: goals.filter(goal => {
      if (goal.completed || goal.archived) return false;
      const deadline = new Date(goal.deadline);
      const today = new Date();
      const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      const progressNeeded = (100 - goal.progress) / Math.max(1, daysRemaining);
      return progressNeeded > 1; // May not complete on time
    }).length,
  };
};

// Export reducer
export default goalsSlice.reducer; 