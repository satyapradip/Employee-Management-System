/**
 * Task Helper Utilities
 * Shared functions for task-related operations
 */

/**
 * Get status color classes
 */
export const getStatusColor = (status) => {
  const colors = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || colors.pending;
};

/**
 * Get priority color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  };
  return colors[priority] || colors.medium;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

/**
 * Format status for display
 */
export const formatStatus = (status) => {
  const statusMap = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending",
    failed: "Failed",
  };
  return statusMap[status] || status;
};
