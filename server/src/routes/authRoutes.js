import { Router } from "express";
import {
  registerAdmin,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  registerAdminValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../validators/authValidator.js";

const router = Router();

// Public routes
router.post(
  "/register-admin",
  registerAdminValidation,
  validate,
  registerAdmin,
);
router.post("/login", loginValidation, validate, login);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword,
);
router.get("/reset-password/:token", verifyResetToken);
router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validate,
  resetPassword,
);

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
