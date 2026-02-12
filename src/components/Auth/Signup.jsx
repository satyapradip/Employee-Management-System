import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const showToast = useToast();

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password cannot exceed 128 characters";
    }

    // Confirm password validation
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
    // Clear error when user types
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
      );

      if (result.success) {
        showToast("Account created successfully! Please sign in.", "success");
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Switch to login after a brief delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Error is handled by AuthProvider, but show toast for visibility
        showToast(result.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast(error.message || "An error occurred during registration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative backdrop-blur-xl bg-white/5 border border-emerald-500/30 p-10 rounded-2xl shadow-2xl shadow-emerald-500/10 w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-20 -z-10"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="relative group">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`w-full bg-white/5 text-white outline-none border ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-emerald-500"
              } py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50`}
              type="text"
              placeholder="Full Name"
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Email Field */}
          <div className="relative group">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`w-full bg-white/5 text-white outline-none border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-emerald-500"
              } py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50`}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`w-full bg-white/5 text-white outline-none border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-emerald-500"
                } py-4 px-5 pr-12 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50`}
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L3 3"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative group">
            <div className="relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`w-full bg-white/5 text-white outline-none border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-emerald-500"
                } py-4 px-5 pr-12 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L3 3"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <button
            className="relative mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            type="submit"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Creating account..." : "Sign up"}
            aria-busy={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;

