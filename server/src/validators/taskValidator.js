import { body } from "express-validator";

/**
 * Task Validation Rules
 */
export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Frontend",
      "Backend",
      "Database",
      "DevOps",
      "Testing",
      "Bug Fix",
      "Feature",
      "Documentation",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("assignedTo")
    .notEmpty()
    .withMessage("Task must be assigned to an employee")
    .isMongoId()
    .withMessage("Invalid employee ID"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

export const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn([
      "Frontend",
      "Backend",
      "Database",
      "DevOps",
      "Testing",
      "Bug Fix",
      "Feature",
      "Documentation",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid employee ID"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

export const failTaskValidation = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Failure reason is required")
    .isLength({ max: 200 })
    .withMessage("Reason cannot exceed 200 characters"),
];
