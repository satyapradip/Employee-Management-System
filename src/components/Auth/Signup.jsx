import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Building2,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const showToast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password cannot exceed 128 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.companyName.trim()
      );

      if (result.success) {
        showToast("Account created successfully! Please sign in.", "success");
        setFormData({
          name: "",
          email: "",
          companyName: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || "Registration failed. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "An unexpected error occurred during signup.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070b14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="glow-ambient-indigo top-[-100px] left-1/2 -translate-x-1/2" />
      <div className="glow-ambient-cyan bottom-[-100px] right-[-50px]" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/60">
          <div className="text-center mb-7">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 mb-4 shadow-lg shadow-indigo-500/25">
              <img
                src="/TeamFlow_logo.png"
                alt="TeamFlow"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Create an account
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5">
              Join your organization on TeamFlow
            </p>
          </div>

          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Sarah Jenkins"
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm ${
                    errors.name ? "border-red-500/60 focus:ring-red-500/30" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@company.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm ${
                    errors.email ? "border-red-500/60 focus:ring-red-500/30" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Company / Team Name (Optional) */}
            <div>
              <label
                htmlFor="signup-company"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Company / Team Name{" "}
                <span className="text-zinc-500 font-normal lowercase">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="signup-company"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Innovations"
                  autoComplete="organization"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (Min 6 characters)"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm ${
                    errors.password ? "border-red-500/60 focus:ring-red-500/30" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm ${
                    errors.confirmPassword ? "border-red-500/60 focus:ring-red-500/30" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
