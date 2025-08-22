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
  Paper,
  Typography as MuiTypography
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Category,
  CalendarToday,
  AttachMoney,
  Savings,
  CreditCard,
  Receipt
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { backgroundColors } from '../../theme';

const FinanceTracker = () => {
  const [financeData, setFinanceData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    title: '',
    description: '',
    amount: '',
    category: 'general',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  // Load finance data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('smart-life-finance');
    if (savedData) {
      setFinanceData(JSON.parse(savedData));
    }
  }, []);

  // Save finance data to localStorage
  useEffect(() => {
    localStorage.setItem('smart-life-finance', JSON.stringify(financeData));
  }, [financeData]);

  const handleAddEntry = () => {
    if (!formData.title.trim() || !formData.amount) return;

    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString()
    };

    setFinanceData([newEntry, ...financeData]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditEntry = () => {
    if (!editingEntry || !formData.title.trim() || !formData.amount) return;

    const updatedEntry = {
      ...editingEntry,
      ...formData,
      amount: parseFloat(formData.amount),
      updatedAt: new Date().toISOString()
    };

    setFinanceData(financeData.map(e => e.id === editingEntry.id ? updatedEntry : e));
    resetForm();
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId) => {
    setFinanceData(financeData.filter(e => e.id !== entryId));
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      title: '',
      description: '',
      amount: '',
      category: 'general',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    });
  };

  const openEditDialog = (entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      title: entry.title,
      description: entry.description,
      amount: entry.amount.toString(),
      category: entry.category,
      date: entry.date,
      paymentMethod: entry.paymentMethod
    });
    setIsAddDialogOpen(true);
  };

  const filteredData = financeData.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || entry.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate financial statistics
  const stats = {
    totalIncome: financeData.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0),
    totalExpenses: financeData.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    topCategories: {}
  };

  stats.balance = stats.totalIncome - stats.totalExpenses;

  // Calculate monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  stats.monthlyIncome = financeData
    .filter(e => e.type === 'income' && new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);
    
  stats.monthlyExpenses = financeData
    .filter(e => e.type === 'expense' && new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate top spending categories
  const categoryExpenses = {};
  financeData
    .filter(e => e.type === 'expense')
    .forEach(e => {
      categoryExpenses[e.category] = (categoryExpenses[e.category] || 0) + e.amount;
    });
  
  stats.topCategories = Object.entries(categoryExpenses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  // Chart data for monthly trends
  const monthlyData = generateMonthlyData();
  
  function generateMonthlyData() {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const monthData = financeData.filter(e => new Date(e.date).getMonth() === i);
      const income = monthData.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
      const expenses = monthData.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      
      data.push({
        month: months[i],
        income,
        expenses,
        balance: income - expenses
      });
    }
    return data;
  }

  // Pie chart data for expense categories
  const expenseCategoryData = Object.entries(categoryExpenses).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#9c27b0', '#f44336'][index % 6]
  }));

  const getTypeColor = (type) => {
    return type === 'income' ? 'success' : 'error';
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? <TrendingUp /> : <TrendingDown />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'default',
      'food': 'warning',
      'transport': 'info',
      'entertainment': 'secondary',
      'health': 'success',
      'education': 'primary',
      'shopping': 'error'
    };
    return colors[category] || 'default';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'cash': <AttachMoney />,
      'card': <CreditCard />,
      'bank': <AccountBalance />,
      'savings': <Savings />
    };
    return icons[method] || <Receipt />;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Finance Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Monitor your income, expenses, and financial health
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          size="large"
        >
          Add Entry
        </Button>
      </Box>

      {/* Financial Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg8 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    ${stats.totalIncome.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Income
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                This month: ${stats.monthlyIncome.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="error.main">
                    ${stats.totalExpenses.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="error.main">
                This month: ${stats.monthlyExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color={stats.balance >= 0 ? 'success.main' : 'error.main'}>
                    ${stats.balance.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color={stats.balance >= 0 ? 'success.main' : 'error.main'}>
                {stats.balance >= 0 ? 'Positive' : 'Negative'} balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: backgroundColors.bg2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Savings sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expense Ratio
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
                Monthly Financial Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={2} />
                  <Line type="monotone" dataKey="balance" stroke="#2196f3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Expense Categories
              </Typography>
              {expenseCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No expense data yet. Start logging your expenses!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Spending Categories */}
      {stats.topCategories.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Top Spending Categories
            </Typography>
            <Grid container spacing={2}>
              {stats.topCategories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category.category}>
                  <Paper sx={{ p: 2, backgroundColor: backgroundColors.bg1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        {category.category}
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        ${category.amount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

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
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expenses</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: backgroundColors.bg3 }}>
              <Typography variant="h6" color="primary.main">
                {financeData.length}
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
                  : 'No finance entries yet. Start tracking your money!'}
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

                  {/* Amount and Type */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={entry.type}
                      color={getTypeColor(entry.type)}
                      size="small"
                      icon={getTypeIcon(entry.type)}
                    />
                    <Typography variant="h5" color={getTypeColor(entry.type)}>
                      ${entry.amount.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Category and Payment Method */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={entry.category}
                      color={getCategoryColor(entry.category)}
                      size="small"
                      icon={<Category />}
                    />
                    <Chip
                      label={entry.paymentMethod}
                      variant="outlined"
                      size="small"
                      icon={getPaymentMethodIcon(entry.paymentMethod)}
                    />
                  </Box>

                  {/* Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
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
          {editingEntry ? 'Edit Entry' : 'Add New Entry'}
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
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
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
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="food">Food & Dining</MenuItem>
                  <MenuItem value="transport">Transportation</MenuItem>
                  <MenuItem value="entertainment">Entertainment</MenuItem>
                  <MenuItem value="health">Health & Fitness</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="shopping">Shopping</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="housing">Housing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            disabled={!formData.title.trim() || !formData.amount}
          >
            {editingEntry ? 'Update Entry' : 'Add Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinanceTracker; 