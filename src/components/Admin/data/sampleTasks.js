/**
 * Sample Tasks Data
 * Used for initial dashboard display
 */

export const sampleTasks = [
  {
    id: 1,
    title: "Build Login UI",
    description: "Create responsive login page using React and Tailwind CSS",
    date: "2026-01-20",
    category: "Frontend",
    assignedTo: "John Doe",
    status: "in-progress",
    priority: "high",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Integrate user authentication API with JWT tokens",
    date: "2026-01-22",
    category: "Backend",
    assignedTo: "Jane Smith",
    status: "pending",
    priority: "high",
  },
  {
    id: 3,
    title: "Database Design",
    description: "Design schema for task management system",
    date: "2026-01-18",
    category: "Database",
    assignedTo: "Mike Johnson",
    status: "completed",
    priority: "medium",
  },
  {
    id: 4,
    title: "Write Unit Tests",
    description: "Write Jest tests for task reducer and actions",
    date: "2026-01-23",
    category: "Testing",
    assignedTo: "Sarah Wilson",
    status: "pending",
    priority: "low",
  },
  {
    id: 5,
    title: "Deploy App",
    description: "Deploy application to Vercel with CI/CD pipeline",
    date: "2026-01-25",
    category: "DevOps",
    assignedTo: "Tom Brown",
    status: "completed",
    priority: "medium",
  },
  {
    id: 6,
    title: "Fix Navbar Bug",
    description: "Resolve alignment issue in responsive navbar",
    date: "2026-01-15",
    category: "Bug Fix",
    assignedTo: "John Doe",
    status: "failed",
    priority: "high",
  },
];

/**
 * Task Categories
 */
export const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Testing",
  "DevOps",
  "Bug Fix",
  "Design",
  "Documentation",
];

/**
 * Task Statuses
 */
export const STATUSES = [
  "all",
  "pending",
  "in-progress",
  "completed",
  "failed",
];

/**
 * Task Priorities
 */
export const PRIORITIES = ["high", "medium", "low"];

/**
 * Sample Employees for assignment
 */
export const EMPLOYEES = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "Tom Brown",
];
