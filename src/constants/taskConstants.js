/**
 * Task Constants
 * Centralized constants for task management
 * These should match the backend Task model enums
 */

/**
 * Task Categories
 * Must match server/src/models/Task.js category enum
 */
export const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Testing",
  "Bug Fix",
  "Feature",
  "Documentation",
  "Other",
];

/**
 * Task Statuses (Frontend format)
 * Backend uses: new, active, completed, failed
 * Frontend displays: all, pending, in-progress, completed, failed
 */
export const STATUSES = [
  "all",
  "pending", // Maps to backend 'new'
  "in-progress", // Maps to backend 'active'
  "completed",
  "failed",
];

/**
 * Task Priorities
 * Must match server/src/models/Task.js priority enum
 */
export const PRIORITIES = ["low", "medium", "high", "urgent"];

/**
 * Status mapping between frontend and backend
 */
export const STATUS_MAP = {
  new: "pending",
  active: "in-progress",
  completed: "completed",
  failed: "failed",
};

/**
 * Status colors for UI
 */
export const STATUS_COLORS = {
  all: "zinc",
  pending: "violet",
  "in-progress": "amber",
  completed: "emerald",
  failed: "rose",
};

/**
 * Priority colors for UI
 */
export const PRIORITY_COLORS = {
  low: "zinc",
  medium: "blue",
  high: "amber",
  urgent: "rose",
};
