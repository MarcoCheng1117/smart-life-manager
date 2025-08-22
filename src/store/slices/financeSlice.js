import { createSlice } from '@reduxjs/toolkit';

// Initial state for finance
const initialState = {
  expenses: [],
  income: [],
  budgets: [],
  financialGoals: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    dateRange: 'month',
    category: 'all',
    type: 'all',
    amountRange: 'all',
  },
  sortBy: 'date',
  sortOrder: 'desc',
};

// Create the finance slice
const financeSlice = createSlice({
  name: 'finance',
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
    
    // Set all expenses
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new expense
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    
    // Update an existing expense
    updateExpense: (state, action) => {
      const { id, updates } = action.payload;
      const expenseIndex = state.expenses.findIndex(expense => expense.id === id);
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = { ...state.expenses[expenseIndex], ...updates };
      }
    },
    
    // Delete an expense
    deleteExpense: (state, action) => {
      const expenseId = action.payload;
      state.expenses = state.expenses.filter(expense => expense.id !== expenseId);
    },
    
    // Set all income
    setIncome: (state, action) => {
      state.income = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add a new income
    addIncome: (state, action) => {
      state.income.push(action.payload);
    },
    
    // Update an existing income
    updateIncome: (state, action) => {
      const { id, updates } = action.payload;
      const incomeIndex = state.income.findIndex(income => income.id === id);
      if (incomeIndex !== -1) {
        state.income[incomeIndex] = { ...state.income[incomeIndex], ...updates };
      }
    },
    
    // Delete an income
    deleteIncome: (state, action) => {
      const incomeId = action.payload;
      state.income = state.income.filter(income => income.id !== incomeId);
    },
    
    // Set budgets
    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    
    // Add budget
    addBudget: (state, action) => {
      state.budgets.push(action.payload);
    },
    
    // Update budget
    updateBudget: (state, action) => {
      const { id, updates } = action.payload;
      const budgetIndex = state.budgets.findIndex(budget => budget.id === id);
      if (budgetIndex !== -1) {
        state.budgets[budgetIndex] = { ...state.budgets[budgetIndex], ...updates };
      }
    },
    
    // Delete budget
    deleteBudget: (state, action) => {
      const budgetId = action.payload;
      state.budgets = state.budgets.filter(budget => budget.id !== budgetId);
    },
    
    // Set financial goals
    setFinancialGoals: (state, action) => {
      state.financialGoals = action.payload;
    },
    
    // Add financial goal
    addFinancialGoal: (state, action) => {
      state.financialGoals.push(action.payload);
    },
    
    // Update financial goal
    updateFinancialGoal: (state, action) => {
      const { id, updates } = action.payload;
      const goalIndex = state.financialGoals.findIndex(goal => goal.id === id);
      if (goalIndex !== -1) {
        state.financialGoals[goalIndex] = { ...state.financialGoals[goalIndex], ...updates };
      }
    },
    
    // Delete financial goal
    deleteFinancialGoal: (state, action) => {
      const goalId = action.payload;
      state.financialGoals = state.financialGoals.filter(goal => goal.id !== goalId);
    },
    
    // Set categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // Add category
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    
    // Update category
    updateCategory: (state, action) => {
      const { id, updates } = action.payload;
      const categoryIndex = state.categories.findIndex(category => category.id === id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = { ...state.categories[categoryIndex], ...updates };
      }
    },
    
    // Delete category
    deleteCategory: (state, action) => {
      const categoryId = action.payload;
      state.categories = state.categories.filter(category => category.id !== categoryId);
    },
    
    // Set filter values
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = {
        dateRange: 'month',
        category: 'all',
        type: 'all',
        amountRange: 'all',
      };
    },
    
    // Set sorting preferences
    setSorting: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order;
    },
    
    // Bulk update expenses
    bulkUpdateExpenses: (state, action) => {
      const { expenseIds, updates } = action.payload;
      state.expenses.forEach(expense => {
        if (expenseIds.includes(expense.id)) {
          Object.assign(expense, updates);
        }
      });
    },
    
    // Bulk delete expenses
    bulkDeleteExpenses: (state, action) => {
      const expenseIds = action.payload;
      state.expenses = state.expenses.filter(expense => !expenseIds.includes(expense.id));
    },
    
    // Bulk update income
    bulkUpdateIncome: (state, action) => {
      const { incomeIds, updates } = action.payload;
      state.income.forEach(income => {
        if (incomeIds.includes(income.id)) {
          Object.assign(income, updates);
        }
      });
    },
    
    // Bulk delete income
    bulkDeleteIncome: (state, action) => {
      const incomeIds = action.payload;
      state.income = state.income.filter(income => !incomeIds.includes(income.id));
    },
    
    // Calculate budget progress
    calculateBudgetProgress: (state, action) => {
      const { budgetId } = action.payload;
      const budget = state.budgets.find(b => b.id === budgetId);
      if (budget) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Calculate expenses for current month in this category
        const monthlyExpenses = state.expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expense.category === budget.category &&
                 expenseDate.getMonth() === currentMonth &&
                 expenseDate.getFullYear() === currentYear;
        });
        
        const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        budget.spent = totalSpent;
        budget.remaining = budget.amount - totalSpent;
        budget.progress = Math.min(100, (totalSpent / budget.amount) * 100);
        budget.status = budget.progress >= 100 ? 'exceeded' : 
                       budget.progress >= 80 ? 'warning' : 'good';
      }
    },
    
    // Update all budget progress
    updateAllBudgetProgress: (state) => {
      state.budgets.forEach(budget => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = state.expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expense.category === budget.category &&
                 expenseDate.getMonth() === currentMonth &&
                 expenseDate.getFullYear() === currentYear;
        });
        
        const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        budget.spent = totalSpent;
        budget.remaining = budget.amount - totalSpent;
        budget.progress = Math.min(100, (totalSpent / budget.amount) * 100);
        budget.status = budget.progress >= 100 ? 'exceeded' : 
                       budget.progress >= 80 ? 'warning' : 'good';
      });
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setIncome,
  addIncome,
  updateIncome,
  deleteIncome,
  setBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  setFinancialGoals,
  addFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setFilter,
  clearFilters,
  setSorting,
  bulkUpdateExpenses,
  bulkDeleteExpenses,
  bulkUpdateIncome,
  bulkDeleteIncome,
  calculateBudgetProgress,
  updateAllBudgetProgress,
} = financeSlice.actions;

// Export selectors
export const selectAllExpenses = (state) => state.finance.expenses;
export const selectAllIncome = (state) => state.finance.income;
export const selectBudgets = (state) => state.finance.budgets;
export const selectFinancialGoals = (state) => state.finance.financialGoals;
export const selectCategories = (state) => state.finance.categories;
export const selectFinanceLoading = (state) => state.finance.loading;
export const selectFinanceError = (state) => state.finance.error;
export const selectFinanceFilters = (state) => state.finance.filters;
export const selectFinanceSorting = (state) => state.finance.sorting;

// Selector for filtered expenses
export const selectFilteredExpenses = (state) => {
  const { expenses, filters, sortBy, sortOrder } = state.finance;
  
  let filteredExpenses = [...expenses];
  
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
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    filteredExpenses = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate;
    });
  }
  
  // Apply category filter
  if (filters.category !== 'all') {
    filteredExpenses = filteredExpenses.filter(expense => expense.category === filters.category);
  }
  
  // Apply amount range filter
  if (filters.amountRange !== 'all') {
    switch (filters.amountRange) {
      case 'low':
        filteredExpenses = filteredExpenses.filter(expense => expense.amount <= 50);
        break;
      case 'medium':
        filteredExpenses = filteredExpenses.filter(expense => expense.amount > 50 && expense.amount <= 200);
        break;
      case 'high':
        filteredExpenses = filteredExpenses.filter(expense => expense.amount > 200);
        break;
      default:
        break;
    }
  }
  
  // Apply sorting
  filteredExpenses.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'date' || sortBy === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle numeric sorting
    if (sortBy === 'amount') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredExpenses;
};

// Selector for filtered income
export const selectFilteredIncome = (state) => {
  const { income, filters, sortBy, sortOrder } = state.finance;
  
  let filteredIncome = [...income];
  
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
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    filteredIncome = filteredIncome.filter(incomeItem => {
      const incomeDate = new Date(incomeItem.date);
      return incomeDate >= startDate;
    });
  }
  
  // Apply category filter
  if (filters.category !== 'all') {
    filteredIncome = filteredIncome.filter(incomeItem => incomeItem.category === filters.category);
  }
  
  // Apply sorting
  filteredIncome.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'date' || sortBy === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle numeric sorting
    if (sortBy === 'amount') {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filteredIncome;
};

// Selector for finance statistics
export const selectFinanceStats = (state) => {
  const { expenses, income, budgets, financialGoals } = state.finance;
  
  // Calculate expense statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate income statistics
  const monthlyIncome = income.filter(incomeItem => {
    const incomeDate = new Date(incomeItem.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });
  
  const totalMonthlyIncome = monthlyIncome.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);
  const totalIncome = income.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);
  
  // Calculate budget statistics
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Calculate financial goal statistics
  const totalGoals = financialGoals.length;
  const completedGoals = financialGoals.filter(goal => goal.completed).length;
  const activeGoals = financialGoals.filter(goal => !goal.completed);
  const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavedAmount = activeGoals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);
  const overallProgress = totalTargetAmount > 0 ? (totalSavedAmount / totalTargetAmount) * 100 : 0;
  
  return {
    monthly: {
      expenses: totalMonthlyExpenses,
      income: totalMonthlyIncome,
      net: totalMonthlyIncome - totalMonthlyExpenses,
    },
    total: {
      expenses: totalExpenses,
      income: totalIncome,
      net: totalIncome - totalExpenses,
    },
    budget: {
      total: totalBudget,
      spent: totalSpent,
      remaining: totalRemaining,
      utilization: budgetUtilization,
      status: budgetUtilization >= 100 ? 'exceeded' : 
              budgetUtilization >= 80 ? 'warning' : 'good',
    },
    goals: {
      total: totalGoals,
      completed: completedGoals,
      active: activeGoals.length,
      targetAmount: totalTargetAmount,
      savedAmount: totalSavedAmount,
      progress: overallProgress,
    },
    trends: {
      // Calculate month-over-month changes
      expenseChange: calculateMonthOverMonthChange(expenses, 'expenses'),
      incomeChange: calculateMonthOverMonthChange(income, 'income'),
    },
  };
};

// Helper function to calculate month-over-month changes
const calculateMonthOverMonthChange = (transactions, type) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthTotal = transactions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  }).reduce((sum, item) => sum + item.amount, 0);
  
  const previousMonthTotal = transactions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === previousMonth && itemDate.getFullYear() === previousYear;
  }).reduce((sum, item) => sum + item.amount, 0);
  
  if (previousMonthTotal === 0) return 0;
  return ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
};

// Export reducer
export default financeSlice.reducer; 