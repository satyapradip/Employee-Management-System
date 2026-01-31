import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validation.js";

const Login = ({ onForgotPassword, onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [errors, setErrors] = useState({});

  const { login, clearError, isLoading } = useAuth();

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
    // Clear error when user types
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
    // Clear error when user types
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

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        setLoginError(result.error || "Login failed. Please try again.");
      } else {
        // Login successful - form will be cleared
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setLoginError(
        error.message || "An unexpected error occurred. Please try again.",
      );
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
            Welcome to EMP
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {loginError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{loginError}</span>
            <button
              type="button"
              onClick={() => {
                setLoginError(null);
                clearError();
              }}
              className="ml-auto text-red-400 hover:text-red-300 cursor-pointer transition-colors"
              aria-label="Dismiss error message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-5" noValidate>
          {/* Email Field */}
          <div className="relative group">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => {
                const validation = validateEmail(email);
                if (!validation.isValid) {
                  setErrors((prev) => ({ ...prev, email: validation.error }));
                }
              }}
              required
              disabled={isSubmitting || isLoading}
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full bg-white/5 text-white outline-none border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-emerald-500"
              } py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-400"
                role="alert"
                aria-live="polite"
              >
                {errors.email}
              </p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => {
                  const validation = validatePassword(password);
                  if (!validation.isValid) {
                    setErrors((prev) => ({
                      ...prev,
                      password: validation.error,
                    }));
                  }
                }}
                required
                disabled={isSubmitting || isLoading}
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full bg-white/5 text-white outline-none border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-emerald-500"
                } py-4 px-5 pr-12 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
                    aria-hidden="true"
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
              <p
                id="password-error"
                className="mt-1 text-sm text-red-400"
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </p>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={isSubmitting || isLoading}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200 bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Forgot password? Click to reset"
            >
              Forgot password?
            </button>
          </div>

          <button
            className="relative mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isLoading}
            aria-label={isSubmitting ? "Signing in..." : "Sign in"}
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignup}
            disabled={isSubmitting || isLoading}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign up for a new account"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
