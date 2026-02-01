import { User } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";
import env from "../config/env.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Normalize email to lowercase for case-insensitive lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists");
  }

  // Create user (only admin can create admin users)
  const userRole = role === "admin" ? "employee" : role || "employee";

  const user = await User.create({
    name,
    email: normalizedEmail, // Use normalized email
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
 *
 * LEARNING NOTES:
 * This is the core authentication function. Study this carefully!
 * Flow: Validate → Find User → Check Password → Generate Token → Return
 */
export const login = asyncHandler(async (req, res) => {
  // STEP 1: Extract email and password from request body
  // req.body comes from express.json() middleware
  const { email, password } = req.body;

  // STEP 2: Basic validation - ensure both fields are provided
  // Why check here? Because we want to fail fast with clear error
  if (!email || !password) {
    throw ApiError.badRequest("Please provide email and password");
  }

  // STEP 3: Normalize email for case-insensitive comparison
  // Why? "User@Email.com" and "user@email.com" should be same user
  // .toLowerCase() → converts to lowercase
  // .trim() → removes extra spaces from start/end
  const normalizedEmail = email.toLowerCase().trim();

  // STEP 4: Find user in database
  // .select("+password") is IMPORTANT:
  // - By default, User model doesn't return password (security)
  // - But we need it here to compare, so we explicitly ask for it with "+"
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  // STEP 5: Check if user exists
  // Security Note: Don't say "user not found" - it reveals if email exists
  // Instead, say "invalid credentials" for both wrong email AND wrong password
  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // STEP 6: Check if user account is active
  // Admin can deactivate users - prevent deactivated users from logging in
  if (!user.isActive) {
    throw ApiError.unauthorized("Your account has been deactivated");
  }

  // STEP 7: Verify password
  // comparePassword is defined in User model (server/src/models/User.js)
  // It uses bcrypt.compare() to check:
  //   - Plain password user typed: "mypassword123"
  //   - Hashed password in DB: "$2a$10$xyz..."
  // Returns true/false
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // STEP 8: Update last login timestamp
  // Useful for tracking user activity
  // { validateBeforeSave: false } → skip validation since we're just updating timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // STEP 9: Generate JWT (JSON Web Token)
  // generateAuthToken is defined in User model
  // Creates a token with user ID, email, role encoded inside
  // Frontend stores this token and sends it with every request
  const token = user.generateAuthToken();

  // STEP 10: Send success response with user data and token
  // ApiResponse.success() is our custom utility (server/src/utils/ApiResponse.js)
  // It standardizes all API responses: { success: true, data: {...}, message: "..." }
  ApiResponse.success(
    {
      user, // User object (password auto-removed by toJSON in model)
      token, // JWT token for authentication
    },
    "Login successful",
  ).send(res);

  // INTERVIEW QUESTION: "Walk me through the login process"
  // ANSWER: You should be able to explain steps 1-10 above!
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

/**
 * @desc    Forgot password - Send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists for security
    ApiResponse.success(
      null,
      "If an account with that email exists, a password reset link has been sent.",
    ).send(res);
    return;
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.badRequest("This account has been deactivated");
  }

  // Generate reset token
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL - using query params format for React app
  // Get base URL (handle multiple URLs in CLIENT_URL)
  const baseUrl = env.CLIENT_URL.split(",")[0].trim();
  const resetUrl = `${baseUrl}?action=reset-password&token=${resetToken}`;

  try {
    // Send email
    await sendPasswordResetEmail(user.email, resetUrl, user.name);

    ApiResponse.success(
      { email: user.email },
      "Password reset link sent to your email",
    ).send(res);
  } catch (error) {
    // If email fails, clear the reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Email send error:", error);
    throw ApiError.internal("Error sending email. Please try again later.");
  }
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Validate password
  if (!password || password.length < 6) {
    throw ApiError.badRequest("Password must be at least 6 characters");
  }

  // Find user by reset token
  const user = await User.findByResetToken(token);

  if (!user) {
    throw ApiError.badRequest("Invalid or expired reset token");
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new auth token
  const authToken = user.generateAuthToken();

  ApiResponse.success(
    { user, token: authToken },
    "Password reset successful. You are now logged in.",
  ).send(res);
});

/**
 * @desc    Verify reset token is valid
 * @route   GET /api/auth/reset-password/:token
 * @access  Public
 */
export const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find user by reset token
  const user = await User.findByResetToken(token);

  if (!user) {
    throw ApiError.badRequest("Invalid or expired reset token");
  }

  ApiResponse.success(
    { valid: true, email: user.email },
    "Token is valid",
  ).send(res);
});
