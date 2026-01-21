import { Router } from "express";
import authRoutes from "./authRoutes.js";
import taskRoutes from "./taskRoutes.js";
import employeeRoutes from "./employeeRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/employees", employeeRoutes);

export default router;
