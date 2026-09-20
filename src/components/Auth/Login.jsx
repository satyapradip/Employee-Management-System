import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validation.js";
import {
  Shield,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const ROLES = [
  {
    key: "admin",
    label: "Admin",
    icon: Shield,
    subtitle: "Manage company, staff & task delegation",
  },
  {
    key: "employee",
    label: "Employee",
    icon: UserCheck,
    subtitle: "Access assigned deliverables & report progress",
  },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [errors, setErrors] = useState({});

  const { login, clearError } = useAuth();

  // Clear errors when user types
  useEffect(() => {
    if (errors.email && email) {
      const validation = validateEmail(email);
      if (validation.isValid) {
        setErrors((prev) => ({ ...prev, email: null }));
      }
    }
  }, [email, errors.email]);

  useEffect(() => {
    if (errors.password && password) {
      const validation = validatePassword(password);
      if (validation.isValid) {
        setErrors((prev) => ({ ...prev, password: null }));
      }
    }
  }, [password, errors.password]);

  // Clear form errors when switching roles
  useEffect(() => {
    setLoginError(null);
    setErrors({});
  }, [selectedRole]);

  const validateForm = () => {
    const newErrors = {};
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      const validation = validateEmail(value);
      if (validation.isValid) {
        setErrors((prev) => ({ ...prev, email: null }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      const validation = validatePassword(value);
      if (validation.isValid) {
        setErrors((prev) => ({ ...prev, password: null }));
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        setLoginError(result.error || "Login failed. Please verify your credentials.");
      } else {
        // Verify the logged-in user matches the selected role
        const user = result.user || result.data?.user;
        if (user && user.role !== selectedRole) {
          setLoginError(
            `This account is registered as ${
              user.role === "admin" ? "an Admin" : "an Employee"
            }. Please toggle the role above to proceed.`
          );
          return;
        }

        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setLoginError(
        error.message || "An unexpected error occurred during authentication."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070b14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="glow-ambient-indigo top-[-100px] left-1/2 -translate-x-1/2" />
      <div className="glow-ambient-cyan bottom-[-100px] right-[-50px]" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Link: Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Auth Glass Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/60 relative">
          {/* Brand Header */}
          <div className="text-center mb-7">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 mb-4 shadow-lg shadow-indigo-500/25">
              <img
                src="/TeamFlow_logo.png"
                alt="TeamFlow"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5">
              Sign in to your TeamFlow workspace
            </p>
          </div>

          {/* Role Switcher Pill Container */}
          <div className="mb-6">
            <div className="grid grid-cols-2 p-1 bg-zinc-900/90 border border-white/10 rounded-xl">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.key;
                return (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setSelectedRole(role.key)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "btn-primary-gradient shadow-md"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {role.label}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-zinc-400 mt-2 font-medium">
              {ROLES.find((r) => r.key === selectedRole)?.subtitle}
            </p>
          </div>

          {/* Error Alert Box */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{loginError}</div>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  clearError();
                }}
                className="text-red-400 hover:text-red-300 text-xs cursor-pointer ml-1"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@company.com"
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm ${
                    errors.password ? "border-red-500/60 focus:ring-red-500/30" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In as {selectedRole === "admin" ? "Admin" : "Employee"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-6 mt-6 border-t border-white/10 text-center">
            {selectedRole === "admin" ? (
              <p className="text-xs text-zinc-400">
                Need to create a new organization?{" "}
                <Link
                  to="/register-company"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Register Workspace Free
                </Link>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Employee accounts are provisioned by your company admin.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
