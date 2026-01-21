import { User, Task } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private/Admin
 */
export const getEmployees = asyncHandler(async (req, res) => {
  const { search, isActive } = req.query;

  let query = { role: "employee" };

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const employees = await User.find(query).sort({ createdAt: -1 });

  // Get task counts for each employee
  const employeesWithStats = await Promise.all(
    employees.map(async (employee) => {
      const taskStats = await Task.aggregate([
        { $match: { assignedTo: employee._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = {
        total: 0,
        new: 0,
        active: 0,
        completed: 0,
        failed: 0,
      };

      taskStats.forEach((s) => {
        stats[s._id] = s.count;
        stats.total += s.count;
      });

      return {
        ...employee.toJSON(),
        taskStats: stats,
      };
    }),
  );

  ApiResponse.success(
    { employees: employeesWithStats },
    "Employees fetched successfully",
  ).send(res);
});

/**
 * @desc    Get single employee
 * @route   GET /api/employees/:id
 * @access  Private/Admin
 */
export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findById(req.params.id);

  if (!employee || employee.role !== "employee") {
    throw ApiError.notFound("Employee not found");
  }

  // Get employee's tasks
  const tasks = await Task.find({ assignedTo: employee._id })
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

  ApiResponse.success(
    {
      employee,
      tasks,
      stats,
    },
    "Employee fetched successfully",
  ).send(res);
});

/**
 * @desc    Create new employee
 * @route   POST /api/employees
 * @access  Private/Admin
 */
export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const employee = await User.create({
    name,
    email,
    password,
    role: "employee",
  });

  ApiResponse.created({ employee }, "Employee created successfully").send(res);
});

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private/Admin
 */
export const updateEmployee = asyncHandler(async (req, res) => {
  const { name, email, isActive } = req.body;

  let employee = await User.findById(req.params.id);

  if (!employee || employee.role !== "employee") {
    throw ApiError.notFound("Employee not found");
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== employee.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("Email already registered");
    }
  }

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (isActive !== undefined) updates.isActive = isActive;

  employee = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success({ employee }, "Employee updated successfully").send(res);
});

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private/Admin
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findById(req.params.id);

  if (!employee || employee.role !== "employee") {
    throw ApiError.notFound("Employee not found");
  }

  // Option 1: Delete employee and all their tasks
  // await Task.deleteMany({ assignedTo: employee._id });
  // await employee.deleteOne();

  // Option 2: Soft delete - deactivate instead
  employee.isActive = false;
  await employee.save();

  ApiResponse.success(null, "Employee deactivated successfully").send(res);
});

/**
 * @desc    Reset employee password
 * @route   PUT /api/employees/:id/reset-password
 * @access  Private/Admin
 */
export const resetEmployeePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    throw ApiError.badRequest("Password must be at least 6 characters");
  }

  const employee = await User.findById(req.params.id);

  if (!employee || employee.role !== "employee") {
    throw ApiError.notFound("Employee not found");
  }

  employee.password = newPassword;
  await employee.save();

  ApiResponse.success(null, "Password reset successfully").send(res);
});

/**
 * @desc    Get employee dashboard stats
 * @route   GET /api/employees/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Total employees
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const activeEmployees = await User.countDocuments({
    role: "employee",
    isActive: true,
  });

  // Task statistics
  const taskStats = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const tasks = {
    total: 0,
    new: 0,
    active: 0,
    completed: 0,
    failed: 0,
  };

  taskStats.forEach((s) => {
    tasks[s._id] = s.count;
    tasks.total += s.count;
  });

  // Recent tasks
  const recentTasks = await Task.find()
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  // Top performers (employees with most completed tasks)
  const topPerformers = await Task.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$assignedTo", completedCount: { $sum: 1 } } },
    { $sort: { completedCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $project: {
        _id: 1,
        completedCount: 1,
        name: "$employee.name",
        email: "$employee.email",
      },
    },
  ]);

  ApiResponse.success(
    {
      employees: {
        total: totalEmployees,
        active: activeEmployees,
      },
      tasks,
      recentTasks,
      topPerformers,
    },
    "Dashboard stats fetched successfully",
  ).send(res);
});
