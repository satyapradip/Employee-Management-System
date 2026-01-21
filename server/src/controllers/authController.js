import { User } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists");
  }

  // Create user (only admin can create admin users)
  const userRole = role === "admin" ? "employee" : role || "employee";

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  // Generate token
  const token = user.generateAuthToken();

  ApiResponse.created(
    {
      user,
      token,
    },
    "User registered successfully",
  ).send(res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest("Please provide email and password");
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.unauthorized("Your account has been deactivated");
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = user.generateAuthToken();

  ApiResponse.success(
    {
      user,
      token,
    },
    "Login successful",
  ).send(res);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  ApiResponse.success({ user }, "User fetched successfully").send(res);
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success({ user }, "Profile updated successfully").send(res);
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = user.generateAuthToken();

  ApiResponse.success({ token }, "Password changed successfully").send(res);
});

/**
 * @desc    Logout user (client-side - just for consistency)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // In JWT auth, logout is handled client-side by removing the token
  // This endpoint is for any server-side cleanup if needed

  ApiResponse.success(null, "Logged out successfully").send(res);
});
