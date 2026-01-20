/**
 * Get status icon name based on task status
 * @param {string} status - Task status
 * @returns {string} - Icon name to use with Icons component
 */
export const getStatusIconName = (status) => {
  switch (status) {
    case "completed":
      return "Check";
    case "in-progress":
      return "Refresh";
    case "pending":
      return "Clock";
    default:
      return null;
  }
};
