// Application State
let currentLanguage = 'zh';
let currentTheme = 'light';
let charts = {};

// Sample Data (in Chinese by default)
const sampleData = {
  goals: [
    {
      id: 1,
      title: "學習新技能",
      category: "學習",
      progress: 65,
      target: 100,
      deadline: "2025-12-31",
      milestones: ["完成基礎課程", "實作第一個專案", "取得認證"]
    },
    {
      id: 2,
      title: "健康管理",
      category: "健康", 
      progress: 40,
      target: 100,
      deadline: "2025-12-31",
      milestones: ["每週運動3次", "體重減5公斤", "改善飲食習慣"]
    }
  ],
  tasks: [
    {
      id: 1,
      title: "完成月度報告",
      priority: "高",
      category: "工作",
      dueDate: "2025-08-25",
      status: "進行中",
      estimatedTime: "2小時",
      completed: false
    },
    {
      id: 2,
      title: "跑步30分鐘",
      priority: "中",
      category: "健康",
      dueDate: "2025-08-22",
      status: "未開始",
      estimatedTime: "30分鐘",
      completed: false
    },
    {
      id: 3,
      title: "閱讀技術文章",
      priority: "低",
      category: "學習",
      dueDate: "2025-08-23",
      status: "未開始",
      estimatedTime: "1小時",
      completed: false
    }
  ],
  workouts: [
    {
      id: 1,
      date: "2025-08-21",
      type: "跑步",
      duration: 30,
      intensity: "中等",
      calories: 300
    },
    {
      id: 2,
      date: "2025-08-20",
      type: "重量訓練",
      duration: 45,
      intensity: "高",
      calories: 400
    },
    {
      id: 3,
      date: "2025-08-19",
      type: "瑜伽",
      duration: 60,
      intensity: "低",
      calories: 200
    }
  ],
  expenses: [
    {
      id: 1,
      date: "2025-08-21",
      category: "餐飲",
      amount: 150,
      description: "午餐",
      type: "支出"
    },
    {
      id: 2,
      date: "2025-08-20", 
      category: "交通",
      amount: 50,
      description: "計程車",
      type: "支出"
    },
    {
      id: 3,
      date: "2025-08-19",
      category: "購物",
      amount: 800,
      description: "衣服",
      type: "支出"
    }
  ],
  habits: [
    {
      name: "早起",
      target: 7,
      currentWeek: [true, true, false, true, true, false, true]
    },
    {
      name: "閱讀",
      target: 7,
      currentWeek: [true, false, true, true, false, true, false]
    },
    {
      name: "運動",
      target: 7,
      currentWeek: [false, true, true, false, true, false, true]
    }
  ]
};

// Language translations
const translations = {
  zh: {
    dashboard: "主儀表板",
    goals: "年度目標",
    tasks: "任務管理",
    health: "健康管理",
    work: "工作專區",
    learning: "學習專區",
    finance: "財務管理",
    life: "生活增強",
    todayOverview: "今日概覽",
    todayTasks: "今日重點任務",
    weekProgress: "本週進度概覽",
    habitTracking: "習慣追蹤",
    aiSuggestions: "智能建議",
    addTask: "新增任務",
    addNote: "快速筆記",
    priority: "優先級",
    high: "高",
    medium: "中",
    low: "低",
    workCat: "工作",
    personal: "個人",
    study: "學習",
    healthCat: "健康",
    family: "家庭"
  },
  en: {
    dashboard: "Dashboard",
    goals: "Annual Goals",
    tasks: "Task Management",
    health: "Health Management",
    work: "Work Zone",
    learning: "Learning Zone",
    finance: "Finance Management",
    life: "Life Enhancement",
    todayOverview: "Today's Overview",
    todayTasks: "Today's Key Tasks",
    weekProgress: "Weekly Progress Overview",
    habitTracking: "Habit Tracking",
    aiSuggestions: "AI Suggestions",
    addTask: "Add Task",
    addNote: "Quick Note",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    workCat: "Work",
    personal: "Personal",
    study: "Study",
    healthCat: "Health",
    family: "Family"
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
  setupEventListeners();
  renderDashboard();
  renderAllSections();
  
  // Initialize charts after a small delay to ensure DOM is ready
  setTimeout(() => {
    initializeCharts();
  }, 100);
});

function initializeApp() {
  // Set initial theme
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  
  // Load saved preferences (but don't apply them initially to avoid issues)
  const savedLang = 'zh'; // Start with Chinese
  const savedTheme = 'light'; // Start with light theme
  
  currentLanguage = savedLang;
  currentTheme = savedTheme;
  
  console.log('App initialized');
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Get elements
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  const langToggle = document.getElementById('langToggle');
  const themeToggle = document.getElementById('themeToggle');
  const quickAddTask = document.getElementById('quickAddTask');
  const quickAddNote = document.getElementById('quickAddNote');
  const taskModal = document.getElementById('taskModal');
  const workoutModal = document.getElementById('workoutModal');
  const taskForm = document.getElementById('taskForm');
  const workoutForm = document.getElementById('workoutForm');

  // Sidebar navigation
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.currentTarget.dataset.section;
      console.log('Clicked sidebar button:', section);
      showSection(section);
      
      // Update active button
      sidebarButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // Language toggle
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Language toggle clicked');
      toggleLanguage();
    });
  }
  
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Theme toggle clicked');
      toggleTheme();
    });
  }
  
  // Quick actions
  if (quickAddTask) {
    quickAddTask.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Quick add task clicked');
      showModal('taskModal');
    });
  }
  
  if (quickAddNote) {
    quickAddNote.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Quick add note clicked');
      addQuickNote();
    });
  }
  
  // Modal controls
  setupModalControls();
  
  // Form submissions
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskSubmit);
  }
  
  if (workoutForm) {
    workoutForm.addEventListener('submit', handleWorkoutSubmit);
  }
  
  // Other action buttons
  const actionButtons = [
    { id: 'addGoal', handler: addGoal },
    { id: 'addTask', handler: () => showModal('taskModal') },
    { id: 'addWorkout', handler: () => showModal('workoutModal') },
    { id: 'addMeal', handler: addMeal },
    { id: 'addMeeting', handler: addMeeting },
    { id: 'addWorkNote', handler: addWorkNote },
    { id: 'addLearning', handler: addLearning },
    { id: 'addExpense', handler: addExpense },
    { id: 'addIncome', handler: addIncome },
    { id: 'addVision', handler: addVision }
  ];
  
  actionButtons.forEach(({ id, handler }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handler();
      });
    }
  });
  
  console.log('Event listeners setup complete');
}

function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    console.log('Section shown:', sectionId);
  } else {
    console.error('Section not found:', sectionId);
  }
}

function toggleLanguage() {
  console.log('Toggling language from', currentLanguage);
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = currentLanguage === 'zh' ? 'EN' : '中文';
  }
  
  updateLanguage();
  console.log('Language toggled to', currentLanguage);
}

function toggleTheme() {
  console.log('Toggling theme from', currentTheme);
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  }
  
  // Update charts for theme change
  setTimeout(() => {
    Object.values(charts).forEach(chart => {
      if (chart) {
        chart.update();
      }
    });
  }, 100);
  
  console.log('Theme toggled to', currentTheme);
}

function updateLanguage() {
  // Update sidebar buttons
  const sidebarTexts = {
    dashboard: "📊 主儀表板",
    goals: "🎯 年度目標",
    tasks: "📝 任務管理",
    health: "💪 健康管理",
    work: "💼 工作專區",
    learning: "📚 學習專區",
    finance: "💰 財務管理",
    life: "🌟 生活增強"
  };
  
  const sidebarTextsEn = {
    dashboard: "📊 Dashboard",
    goals: "🎯 Goals",
    tasks: "📝 Tasks",
    health: "💪 Health",
    work: "💼 Work",
    learning: "📚 Learning",
    finance: "💰 Finance",
    life: "🌟 Life"
  };
  
  const texts = currentLanguage === 'zh' ? sidebarTexts : sidebarTextsEn;
  
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    const section = btn.dataset.section;
    if (texts[section]) {
      btn.textContent = texts[section];
    }
  });
  
  // Re-render all content
  renderAllSections();
}

function renderDashboard() {
  renderTodayTasks();
  renderHabitsTracker();
  renderAISuggestions();
}

function renderTodayTasks() {
  const todayTasksContainer = document.getElementById('todayTasks');
  if (!todayTasksContainer) return;
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = sampleData.tasks.filter(task => 
    task.dueDate === today || task.dueDate <= today
  ).slice(0, 3); // Limit to 3 tasks for dashboard
  
  todayTasksContainer.innerHTML = todayTasks.map(task => `
    <div class="task-item" data-task-id="${task.id}">
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span class="status status--${getPriorityClass(task.priority)}">${task.priority}</span>
          <span>${task.category}</span>
          <span>${task.estimatedTime}</span>
        </div>
      </div>
      <div class="task-actions">
        <div class="task-check ${task.completed ? 'completed' : ''}" 
             onclick="toggleTaskCompletion(${task.id})">
          ${task.completed ? '✓' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderHabitsTracker() {
  const habitsContainer = document.getElementById('habitsTracker');
  if (!habitsContainer) return;
  
  habitsContainer.innerHTML = `
    <div class="habits-tracker">
      ${sampleData.habits.map((habit, index) => `
        <div class="habit-item">
          <div class="habit-name">${habit.name}</div>
          <div class="habit-dots">
            ${habit.currentWeek.map((completed, dayIndex) => `
              <div class="habit-dot ${completed ? 'completed' : ''}" 
                   onclick="toggleHabit(${index}, ${dayIndex})"></div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAISuggestions() {
  const suggestionsContainer = document.getElementById('aiSuggestions');
  if (!suggestionsContainer) return;
  
  // Generate dynamic suggestions based on data
  const suggestions = generateAISuggestions();
  
  suggestionsContainer.innerHTML = suggestions.map(suggestion => `
    <div class="suggestion-item">
      <p>${suggestion}</p>
    </div>
  `).join('');
}

function generateAISuggestions() {
  const suggestions = [];
  
  // Task-based suggestions
  const overdueTasks = sampleData.tasks.filter(task => 
    new Date(task.dueDate) < new Date() && !task.completed
  );
  
  if (overdueTasks.length > 0) {
    suggestions.push(`您有 ${overdueTasks.length} 個逾期任務，建議優先完成「${overdueTasks[0].title}」`);
  }
  
  // Health-based suggestions
  const recentWorkouts = sampleData.workouts.slice(-3);
  if (recentWorkouts.length > 0) {
    const avgCalories = recentWorkouts.reduce((sum, w) => sum + w.calories, 0) / recentWorkouts.length;
    
    if (avgCalories < 250) {
      suggestions.push('建議增加運動強度，提升每次運動的卡路里消耗');
    }
  }
  
  // Habit-based suggestions
  if (sampleData.habits.length > 0) {
    const habitCompletion = sampleData.habits[0].currentWeek.filter(Boolean).length;
    if (habitCompletion < 5) {
      suggestions.push('本週習慣完成率較低，建議設定提醒來保持一致性');
    }
  }
  
  // Default suggestions if no specific ones generated
  if (suggestions.length === 0) {
    suggestions.push('今天是個開始新習慣的好日子！');
    suggestions.push('記得保持工作和生活的平衡');
  }
  
  return suggestions;
}

function renderAllSections() {
  renderGoals();
  renderTasks();
  renderHealth();
  renderWorkouts();
  renderFinance();
}

function renderGoals() {
  const goalsContainer = document.getElementById('goalsList');
  if (!goalsContainer) return;
  
  goalsContainer.innerHTML = sampleData.goals.map(goal => `
    <div class="goal-card">
      <div class="goal-header">
        <div>
          <div class="goal-title">${goal.title}</div>
          <div class="goal-category">${goal.category}</div>
        </div>
        <span class="status status--info">${Math.round(goal.progress)}%</span>
      </div>
      <div class="goal-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${goal.progress}%;"></div>
        </div>
        <div class="progress-text">
          <span>進度</span>
          <span>截止: ${goal.deadline}</span>
        </div>
      </div>
      <div class="goal-milestones">
        ${goal.milestones.map(milestone => `
          <div class="milestone">• ${milestone}</div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderTasks() {
  const tasksContainer = document.getElementById('tasksList');
  if (!tasksContainer) return;
  
  tasksContainer.innerHTML = sampleData.tasks.map(task => `
    <div class="task-item" data-task-id="${task.id}">
      <div class="task-content">
        <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
        <div class="task-meta">
          <span class="status status--${getPriorityClass(task.priority)}">${task.priority}</span>
          <span>${task.category}</span>
          <span>截止: ${task.dueDate}</span>
          <span>${task.estimatedTime}</span>
        </div>
      </div>
      <div class="task-actions">
        <div class="task-check ${task.completed ? 'completed' : ''}" 
             onclick="toggleTaskCompletion(${task.id})">
          ${task.completed ? '✓' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderHealth() {
  const workoutsContainer = document.getElementById('recentWorkouts');
  if (!workoutsContainer) return;
  
  const recentWorkouts = sampleData.workouts.slice(-5).reverse();
  
  workoutsContainer.innerHTML = recentWorkouts.map(workout => `
    <div class="workout-item">
      <div class="workout-info">
        <strong>${workout.type}</strong>
        <span>${workout.date}</span>
      </div>
      <div class="workout-stats">
        <span>${workout.duration}分鐘</span>
        <span>${workout.calories}卡</span>
        <span class="status status--${getIntensityClass(workout.intensity)}">${workout.intensity}</span>
      </div>
    </div>
  `).join('');
}

function renderWorkouts() {
  // This function can be used for additional workout rendering if needed
  renderHealth();
}

function renderFinance() {
  // Finance rendering is handled by the static HTML for now
  // Can be enhanced later with dynamic content
}

function initializeCharts() {
  console.log('Initializing charts...');
  try {
    initProgressChart();
    initWorkoutChart();
    initExpenseChart();
    console.log('Charts initialized successfully');
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

function initProgressChart() {
  const ctx = document.getElementById('progressChart');
  if (!ctx) {
    console.log('Progress chart canvas not found');
    return;
  }
  
  try {
    const completedTasks = sampleData.tasks.filter(t => t.completed).length;
    const inProgressTasks = sampleData.tasks.filter(t => !t.completed && t.status === '進行中').length;
    const notStartedTasks = sampleData.tasks.filter(t => t.status === '未開始').length;
    
    charts.progress = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['已完成', '進行中', '未開始'],
        datasets: [{
          data: [completedTasks, inProgressTasks, notStartedTasks],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating progress chart:', error);
  }
}

function initWorkoutChart() {
  const ctx = document.getElementById('workoutChart');
  if (!ctx) {
    console.log('Workout chart canvas not found');
    return;
  }
  
  try {
    const last7Days = getLast7Days();
    const workoutData = last7Days.map(date => {
      const workout = sampleData.workouts.find(w => w.date === date);
      return workout ? workout.calories : 0;
    });
    
    charts.workout = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => date.slice(5)),
        datasets: [{
          label: '卡路里消耗',
          data: workoutData,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating workout chart:', error);
  }
}

function initExpenseChart() {
  const ctx = document.getElementById('expenseChart');
  if (!ctx) {
    console.log('Expense chart canvas not found');
    return;
  }
  
  try {
    const expensesByCategory = {};
    sampleData.expenses.forEach(expense => {
      if (expense.type === '支出') {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
      }
    });
    
    charts.expense = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(expensesByCategory),
        datasets: [{
          data: Object.values(expensesByCategory),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating expense chart:', error);
  }
}

// Modal Functions
function setupModalControls() {
  // Close modal buttons
  const closeButtons = document.querySelectorAll('.modal-close, #cancelTask, #cancelWorkout');
  closeButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModals();
      });
    }
  });
  
  // Click outside to close
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModals();
      }
    });
  });
}

function showModal(modalId) {
  console.log('Showing modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    console.log('Modal shown');
  } else {
    console.error('Modal not found:', modalId);
  }
}

function hideModals() {
  console.log('Hiding all modals');
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Form Handlers
function handleTaskSubmit(e) {
  e.preventDefault();
  console.log('Handling task submit');
  
  const title = document.getElementById('taskTitle');
  const priority = document.getElementById('taskPriority');
  const category = document.getElementById('taskCategory');
  const dueDate = document.getElementById('taskDueDate');
  
  if (!title || !title.value) {
    alert('請輸入任務名稱');
    return;
  }
  
  const task = {
    id: Date.now(),
    title: title.value,
    priority: priority ? priority.value : '中',
    category: category ? category.value : '個人',
    dueDate: dueDate ? dueDate.value : new Date().toISOString().split('T')[0],
    status: '未開始',
    estimatedTime: '1小時',
    completed: false
  };
  
  sampleData.tasks.push(task);
  hideModals();
  
  // Clear form
  if (title) title.value = '';
  if (dueDate) dueDate.value = '';
  
  // Re-render affected sections
  renderDashboard();
  renderTasks();
  
  console.log('Task added successfully');
}

function handleWorkoutSubmit(e) {
  e.preventDefault();
  console.log('Handling workout submit');
  
  const type = document.getElementById('workoutType');
  const duration = document.getElementById('workoutDuration');
  const intensity = document.getElementById('workoutIntensity');
  
  if (!duration || !duration.value) {
    alert('請輸入運動時長');
    return;
  }
  
  const workout = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    type: type ? type.value : '跑步',
    duration: parseInt(duration.value),
    intensity: intensity ? intensity.value : '中等',
    calories: calculateCalories(
      type ? type.value : '跑步',
      parseInt(duration.value),
      intensity ? intensity.value : '中等'
    )
  };
  
  sampleData.workouts.push(workout);
  hideModals();
  
  // Clear form
  if (duration) duration.value = '';
  
  // Re-render affected sections
  renderHealth();
  updateWorkoutChart();
  
  console.log('Workout added successfully');
}

// Utility Functions
function getPriorityClass(priority) {
  const classes = { '高': 'error', '中': 'warning', '低': 'info' };
  return classes[priority] || 'info';
}

function getIntensityClass(intensity) {
  const classes = { '高': 'error', '中等': 'warning', '低': 'info' };
  return classes[intensity] || 'info';
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function calculateCalories(type, duration, intensity) {
  const baseCalories = {
    '跑步': 10,
    '游泳': 12,
    '重量訓練': 8,
    '瑜伽': 4,
    '騎自行車': 7,
    '健走': 5
  };
  
  const intensityMultiplier = {
    '低': 0.8,
    '中等': 1.0,
    '高': 1.3
  };
  
  return Math.round((baseCalories[type] || 5) * duration * (intensityMultiplier[intensity] || 1.0));
}

// Global functions for inline event handlers
window.toggleTaskCompletion = function(taskId) {
  console.log('Toggling task completion:', taskId);
  const task = sampleData.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    task.status = task.completed ? '已完成' : '進行中';
    renderDashboard();
    renderTasks();
  }
};

window.toggleHabit = function(habitIndex, dayIndex) {
  console.log('Toggling habit:', habitIndex, dayIndex);
  if (sampleData.habits[habitIndex]) {
    sampleData.habits[habitIndex].currentWeek[dayIndex] = 
      !sampleData.habits[habitIndex].currentWeek[dayIndex];
    renderHabitsTracker();
  }
};

function updateWorkoutChart() {
  if (charts.workout) {
    const last7Days = getLast7Days();
    const workoutData = last7Days.map(date => {
      const workout = sampleData.workouts.find(w => w.date === date);
      return workout ? workout.calories : 0;
    });
    
    charts.workout.data.datasets[0].data = workoutData;
    charts.workout.update();
  }
}

// Placeholder functions for additional features
function addQuickNote() {
  const note = prompt(currentLanguage === 'zh' ? '輸入快速筆記:' : 'Enter quick note:');
  if (note) {
    alert((currentLanguage === 'zh' ? '筆記已儲存: ' : 'Note saved: ') + note);
  }
}

function addGoal() {
  alert(currentLanguage === 'zh' ? '新增目標功能開發中...' : 'Add goal feature in development...');
}

function addMeal() {
  alert(currentLanguage === 'zh' ? '飲食記錄功能開發中...' : 'Meal tracking feature in development...');
}

function addMeeting() {
  alert(currentLanguage === 'zh' ? '會議筆記功能開發中...' : 'Meeting notes feature in development...');
}

function addWorkNote() {
  alert(currentLanguage === 'zh' ? '工作筆記功能開發中...' : 'Work notes feature in development...');
}

function addLearning() {
  alert(currentLanguage === 'zh' ? '學習計畫功能開發中...' : 'Learning plan feature in development...');
}

function addExpense() {
  alert(currentLanguage === 'zh' ? '支出記錄功能開發中...' : 'Expense tracking feature in development...');
}

function addIncome() {
  alert(currentLanguage === 'zh' ? '收入記錄功能開發中...' : 'Income tracking feature in development...');
}

function addVision() {
  alert(currentLanguage === 'zh' ? '願景設定功能開發中...' : 'Vision setting feature in development...');
}