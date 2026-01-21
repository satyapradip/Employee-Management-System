import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  acceptTask,
  completeTask,
  failTask,
  getTaskStats,
} from "../controllers/taskController.js";
import { protect, isAdmin } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createTaskValidation,
  updateTaskValidation,
  failTaskValidation,
} from "../validators/taskValidator.js";

const router = Router();

// All routes require authentication
router.use(protect);

// Get tasks (employees see their own, admin sees all)
router.get("/", getTasks);

// Task stats (admin only)
router.get("/stats", isAdmin, getTaskStats);

// Get single task
router.get("/:id", getTask);

// Create task (admin only)
router.post("/", isAdmin, createTaskValidation, validate, createTask);

// Update task (admin only)
router.put("/:id", isAdmin, updateTaskValidation, validate, updateTask);

// Delete task (admin only)
router.delete("/:id", isAdmin, deleteTask);

// Employee task actions
router.put("/:id/accept", acceptTask);
router.put("/:id/complete", completeTask);
router.put("/:id/fail", failTaskValidation, validate, failTask);

export default router;
