import { Task, User } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

/**
 * @desc    Get all tasks (Admin: all, Employee: own tasks)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const { status, category, priority, assignedTo, search } = req.query;

  // Build query
  let query = {};

  // If employee, only show their tasks
  if (req.user.role === "employee") {
    query.assignedTo = req.user._id;
  } else if (assignedTo) {
    // Admin can filter by employee
    query.assignedTo = assignedTo;
  }

  // Filter by status
  if (status && status !== "all") {
    query.status = status;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  // Search in title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email")
    .sort({ createdAt: -1 });

  // Calculate stats
  const stats = {
    total: tasks.length,
    new: tasks.filter((t) => t.status === "new").length,
    active: tasks.filter((t) => t.status === "active").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    failed: tasks.filter((t) => t.status === "failed").length,
  };

  ApiResponse.success({ tasks, stats }, "Tasks fetched successfully").send(res);
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  // Check access - employee can only view their own tasks
  if (
    req.user.role === "employee" &&
    task.assignedTo._id.toString() !== req.user._id.toString()
  ) {
    throw ApiError.forbidden("Not authorized to view this task");
  }

  ApiResponse.success({ task }, "Task fetched successfully").send(res);
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private/Admin
 */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, category, priority, assignedTo, dueDate } =
    req.body;

  // Verify assignedTo user exists and is an employee
  const employee = await User.findById(assignedTo);
  if (!employee) {
    throw ApiError.notFound("Employee not found");
  }
  if (employee.role !== "employee") {
    throw ApiError.badRequest("Tasks can only be assigned to employees");
  }

  const task = await Task.create({
    title,
    description,
    category,
    priority: priority || "medium",
    assignedTo,
    assignedBy: req.user._id,
    dueDate,
    status: "new",
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  ApiResponse.created(
    { task: populatedTask },
    "Task created successfully",
  ).send(res);
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private/Admin
 */
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  const allowedUpdates = [
    "title",
    "description",
    "category",
    "priority",
    "dueDate",
    "assignedTo",
  ];
  const updates = {};

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  ApiResponse.success({ task }, "Task updated successfully").send(res);
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Admin
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  await task.deleteOne();

  ApiResponse.success(null, "Task deleted successfully").send(res);
});

/**
 * @desc    Accept a task (Employee)
 * @route   PUT /api/tasks/:id/accept
 * @access  Private/Employee
 */
export const acceptTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  // Verify ownership
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to accept this task");
  }

  // Check if task is in 'new' status
  if (task.status !== "new") {
    throw ApiError.badRequest("Only new tasks can be accepted");
  }

  task.status = "active";
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  ApiResponse.success(
    { task: populatedTask },
    "Task accepted successfully",
  ).send(res);
});

/**
 * @desc    Complete a task (Employee)
 * @route   PUT /api/tasks/:id/complete
 * @access  Private/Employee
 */
export const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  // Verify ownership
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to complete this task");
  }

  // Check if task is active
  if (task.status !== "active") {
    throw ApiError.badRequest("Only active tasks can be completed");
  }

  task.status = "completed";
  task.completedAt = new Date();
  task.notes = req.body.notes || "";
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  ApiResponse.success(
    { task: populatedTask },
    "Task completed successfully",
  ).send(res);
});

/**
 * @desc    Mark task as failed (Employee)
 * @route   PUT /api/tasks/:id/fail
 * @access  Private/Employee
 */
export const failTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  // Verify ownership
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to update this task");
  }

  // Check if task is active
  if (task.status !== "active") {
    throw ApiError.badRequest("Only active tasks can be marked as failed");
  }

  if (!req.body.reason) {
    throw ApiError.badRequest("Please provide a reason for failure");
  }

  task.status = "failed";
  task.failedAt = new Date();
  task.failureReason = req.body.reason;
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  ApiResponse.success({ task: populatedTask }, "Task marked as failed").send(
    res,
  );
});

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 * @access  Private/Admin
 */
export const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await Task.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = {
    total: 0,
    new: 0,
    active: 0,
    completed: 0,
    failed: 0,
    byCategory: {},
  };

  stats.forEach((s) => {
    formattedStats[s._id] = s.count;
    formattedStats.total += s.count;
  });

  categoryStats.forEach((c) => {
    formattedStats.byCategory[c._id] = c.count;
  });

  ApiResponse.success(
    { stats: formattedStats },
    "Stats fetched successfully",
  ).send(res);
});
