const express = require('express');
const router = express.Router();

// Import middleware
const { protect, requireOwnership } = require('../middlewares/auth');
const { validateTask, validateId, validatePagination } = require('../middlewares/validation');
const { asyncHandler } = require('../middlewares/errorHandler');

// Import controller (to be created)
const tasksController = require('../controllers/tasksController');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get('/',
  validatePagination,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, sortBy = 'dueDate', sortOrder = 'asc', status, priority, category } = req.query;
    
    // Build query - CRITICAL: Always filter by userId
    const query = { userId: req.user._id };
    
    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with user isolation
    const tasks = await req.app.locals.Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('project', 'name')
      .lean();
    
    // Get total count for pagination
    const total = await req.app.locals.Task.countDocuments(query);
    
    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  })
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id',
  validateId,
  requireOwnership('Task'),
  asyncHandler(async (req, res) => {
    const task = await req.app.locals.Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('dependencies', 'title status')
      .populate('subtasks', 'title status progress')
      .lean();
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  })
);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/',
  validateTask,
  asyncHandler(async (req, res) => {
    // CRITICAL: Always set userId from authenticated user
    const taskData = {
      ...req.body,
      userId: req.user._id
    };
    
    const task = await req.app.locals.Task.create(taskData);
    
    // Populate related fields
    await task.populate('project', 'name');
    
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  })
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id',
  validateId,
  requireOwnership('Task'),
  validateTask,
  asyncHandler(async (req, res) => {
    const task = await req.app.locals.Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'userId' && key !== '_id') { // Prevent changing ownership
        task[key] = req.body[key];
      }
    });
    
    await task.save();
    
    // Populate related fields
    await task.populate('project', 'name');
    
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  })
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id',
  validateId,
  requireOwnership('Task'),
  asyncHandler(async (req, res) => {
    const task = await req.app.locals.Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    // Check if task has dependencies
    const hasDependencies = await req.app.locals.Task.exists({
      dependencies: req.params.id,
      userId: req.user._id
    });
    
    if (hasDependencies) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete task with dependencies',
        code: 'TASK_HAS_DEPENDENCIES'
      });
    }
    
    await task.remove();
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  })
);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private
 */
router.patch('/:id/status',
  validateId,
  requireOwnership('Task'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!status || !['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
        code: 'INVALID_STATUS'
      });
    }
    
    const task = await req.app.locals.Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    task.status = status;
    
    // Set completion date if status is completed
    if (status === 'completed') {
      task.completedDate = new Date();
    }
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task status updated successfully'
    });
  })
);

/**
 * @route   PATCH /api/tasks/:id/progress
 * @desc    Update task progress
 * @access  Private
 */
router.patch('/:id/progress',
  validateId,
  requireOwnership('Task'),
  asyncHandler(async (req, res) => {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'Progress must be between 0 and 100',
        code: 'INVALID_PROGRESS'
      });
    }
    
    const task = await req.app.locals.Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    task.progress = progress;
    
    // Auto-update status based on progress
    if (progress === 100 && task.status !== 'completed') {
      task.status = 'completed';
      task.completedDate = new Date();
    } else if (progress > 0 && progress < 100 && task.status === 'pending') {
      task.status = 'in-progress';
    }
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task progress updated successfully'
    });
  })
);

/**
 * @route   GET /api/tasks/stats/overview
 * @desc    Get task statistics for the authenticated user
 * @access  Private
 */
router.get('/stats/overview',
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    // CRITICAL: All aggregations must filter by userId
    const stats = await req.app.locals.Task.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          overdue: { $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', new Date()] }, { $ne: ['$status', 'completed'] }] }, 1, 0] } }
        }
      }
    ]);
    
    const result = stats[0] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      cancelled: 0,
      overdue: 0
    };
    
    // Calculate percentages
    result.completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;
    result.overdueRate = result.total > 0 ? Math.round((result.overdue / result.total) * 100) : 0;
    
    res.json({
      success: true,
      data: result
    });
  })
);

/**
 * @route   GET /api/tasks/search
 * @desc    Search tasks by title or description
 * @access  Private
 */
router.get('/search',
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long',
        code: 'INVALID_SEARCH_QUERY'
      });
    }
    
    // Build search query with user isolation
    const query = {
      userId: req.user._id,
      $or: [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(q.trim(), 'i')] } }
      ]
    };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const tasks = await req.app.locals.Task.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('project', 'name')
      .lean();
    
    const total = await req.app.locals.Task.countDocuments(query);
    
    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  })
);

module.exports = router; 