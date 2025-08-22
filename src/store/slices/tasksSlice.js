import { createSlice } from '@reduxjs/toolkit';

// Initial state for tasks
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    dueDate: 'all',
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

// Create the tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
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
    
    // Set all tasks
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new task
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    
    // Update an existing task
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    
    // Delete a task
    deleteTask: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    
    // Toggle task completion status
    toggleTaskCompletion: (state, action) => {
      const taskId = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'in-progress';
        task.completedAt = task.completed ? new Date().toISOString() : null;
      }
    },
    
    // Update task priority
    updateTaskPriority: (state, action) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
      }
    },
    
    // Update task status
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.status = status;
        if (status === 'completed') {
          task.completed = true;
          task.completedAt = new Date().toISOString();
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
        status: 'all',
        priority: 'all',
        category: 'all',
        dueDate: 'all',
      };
    },
    
    // Set sorting preferences
    setSorting: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order;
    },
    
    // Bulk update tasks (for batch operations)
    bulkUpdateTasks: (state, action) => {
      const { taskIds, updates } = action.payload;
      state.tasks.forEach(task => {
        if (taskIds.includes(task.id)) {
          Object.assign(task, updates);
        }
      });
    },
    
    // Bulk delete tasks
    bulkDeleteTasks: (state, action) => {
      const taskIds = action.payload;
      state.tasks = state.tasks.filter(task => !taskIds.includes(task.id));
    },
    
    // Reorder tasks (for drag and drop)
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.tasks.splice(sourceIndex, 1);
      state.tasks.splice(destinationIndex, 0, removed);
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  updateTaskPriority,
  updateTaskStatus,
  setFilter,
  clearFilters,
  setSorting,
  bulkUpdateTasks,
  bulkDeleteTasks,
  reorderTasks,
} = tasksSlice.actions;

// Export selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksFilters = (state) => state.tasks.filters;
export const selectTasksSorting = (state) => state.tasks.sorting;

// Selector for filtered and sorted tasks
export const selectFilteredTasks = (state) => {
  const { tasks, filters, sortBy, sortOrder } = state.tasks;
  
  let filteredTasks = [...tasks];
  
  // Apply filters
  if (filters.status !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }
  
  if (filters.priority !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
  }
  
  if (filters.category !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.category === filters.category);
  }
  
  if (filters.dueDate !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filters.dueDate) {
      case 'today':
        filteredTasks = filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        break;
      case 'overdue':
        filteredTasks = filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today && !task.completed;
        });
        break;
      case 'this-week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        filteredTasks = filteredTasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= endOfWeek;
        });
        break;
      default:
        break;
    }
  }
  
  // Apply sorting
  filteredTasks.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'dueDate' || sortBy === 'createdAt' || sortBy === 'completedAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle priority sorting
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredTasks;
};

// Selector for task statistics
export const selectTaskStats = (state) => {
  const tasks = state.tasks.tasks;
  
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    overdue: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && !task.completed;
    }).length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    mediumPriority: tasks.filter(task => task.priority === 'medium').length,
    lowPriority: tasks.filter(task => task.priority === 'low').length,
  };
};

// Export reducer
export default tasksSlice.reducer; 