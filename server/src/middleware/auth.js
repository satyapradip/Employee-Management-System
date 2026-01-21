import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { ApiError, asyncHandler } from "../utils/index.js";
import env from "../config/env.js";

/**
 * Protect routes - Verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check for token in cookies (optional)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw ApiError.unauthorized("Not authorized to access this route");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    if (!user.isActive) {
      throw ApiError.unauthorized("User account is deactivated");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Token expired");
    }
    throw error;
  }
});

/**
 * Authorize specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this route`,
      );
    }
    next();
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw ApiError.forbidden("Admin access required");
  }
  next();
};

/**
 * Check if user is the owner or admin
 */
export const isOwnerOrAdmin = (paramName = "id") => {
  return (req, res, next) => {
    const resourceId = req.params[paramName];
    const isOwner = req.user._id.toString() === resourceId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw ApiError.forbidden("Not authorized to access this resource");
    }
    next();
  };
};
