import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useToast from "../../hooks/useToast.js";
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
} from "lucide-react";

const ROLES = [
  {
    key: "admin",
    label: "Admin Portal",
    icon: Shield,
    subtitle: "Manage company, staff & task delegation",
  },
  {
    key: "employee",
    label: "Employee Portal",
    icon: UserCheck,
    subtitle: "Access assigned deliverables & report progress",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const showToast = useToast();
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
        const loggedInUser = result.user || result.data?.user;
        const targetRoute = loggedInUser?.role === "admin" ? "/admin" : "/employee";
        showToast(`Welcome back, ${loggedInUser?.name || "Member"}!`, "success");
        navigate(targetRoute, { replace: true });

        // Immediate fallback in case router state needs a sync tick
        setTimeout(() => {
          if (window.location.pathname === "/login") {
            window.location.href = targetRoute;
          }
        }, 120);
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
    <div className="min-h-screen w-full bg-[#F5F6F7] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Link: Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#5E6875] hover:text-[#15191E] transition-colors mb-5 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Auth White Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E1E5E9] shadow-lg shadow-black/4 relative">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#101827] text-white mb-3.5 shadow-xs">
              <span className="font-display font-black text-sm tracking-tight">TF</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-[#15191E] tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#5E6875] text-xs sm:text-sm mt-1">
              Sign in to your TeamFlow workspace
            </p>
          </div>

          {/* Role Switcher Pill Container */}
          <div className="mb-5">
            <div className="grid grid-cols-2 p-1 bg-[#F5F6F7] border border-[#E1E5E9] rounded-xl">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.key;
                return (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setSelectedRole(role.key)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#101827] text-white shadow-xs"
                        : "text-[#5E6875] hover:text-[#15191E]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-[#87909B] mt-2 font-medium">
              {ROLES.find((r) => r.key === selectedRole)?.subtitle}
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="mb-5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E1E5E9] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#5E6875] font-medium pl-1">
              Quick Fill:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("admin");
                  setEmail("admin@company.com");
                  setPassword("admin123");
                  setLoginError(null);
                  setErrors({});
                }}
                className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#3730A3] text-[11px] font-semibold border border-[#E0E7FF] transition-all cursor-pointer flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("employee");
                  setEmail("john@company.com");
                  setPassword("123456");
                  setLoginError(null);
                  setErrors({});
                }}
                className="px-2.5 py-1 rounded-lg bg-[#E1F4F1] hover:bg-[#CCFBF1] text-[#0F766E] text-[11px] font-semibold border border-[#CCFBF1] transition-all cursor-pointer flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                Employee Demo
              </button>
            </div>
          </div>

          {/* Error Alert Box */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{loginError}</div>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  clearError();
                }}
                className="text-[#B91C1C] hover:text-[#7F1D1D] text-xs cursor-pointer ml-1"
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
                className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87909B]" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all ${
                    errors.email ? "border-[#B91C1C] focus:ring-[#B91C1C]/10" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#4F46E5] hover:text-[#3730A3] transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87909B]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all ${
                    errors.password ? "border-[#B91C1C] focus:ring-[#B91C1C]/10" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#87909B] hover:text-[#15191E] cursor-pointer transition-colors"
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
                <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-6 disabled:opacity-50"
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
          <div className="pt-5 mt-6 border-t border-[#E1E5E9] text-center">
            {selectedRole === "admin" ? (
              <p className="text-xs text-[#5E6875]">
                Need to create a new organization?{" "}
                <Link
                  to="/register-company"
                  className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors"
                >
                  Register Workspace
                </Link>
              </p>
            ) : (
              <p className="text-xs text-[#5E6875]">
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
