import { Router } from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
  getDashboardStats,
} from "../controllers/employeeController.js";
import { protect, isAdmin } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createEmployeeValidation,
  updateEmployeeValidation,
  resetPasswordValidation,
} from "../validators/employeeValidator.js";

const router = Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// CRUD operations
router.get("/", getEmployees);
router.get("/:id", getEmployee);

router.post("/", createEmployeeValidation, validate, createEmployee);

router.put("/:id", updateEmployeeValidation, validate, updateEmployee);
router.delete("/:id", deleteEmployee);

// Reset password
router.put(
  "/:id/reset-password",
  resetPasswordValidation,
  validate,
  resetEmployeePassword,
);

export default router;
