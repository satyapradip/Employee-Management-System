import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} from "../validators/authValidator.js";

const router = Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.use(protect); // All routes below require authentication

router.get("/me", getMe);
router.put("/me", updateProfile);
router.put(
  "/change-password",
  changePasswordValidation,
  validate,
  changePassword,
);
router.post("/logout", logout);

export default router;
