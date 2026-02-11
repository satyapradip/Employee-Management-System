import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validation.js";

const ROLES = [
  {
    key: "admin",
    label: "Admin",
    icon: (
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    subtitle: "Manage employees & tasks",
  },
  {
    key: "employee",
    label: "Employee",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    subtitle: "View & complete tasks",
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
        setLoginError(result.error || "Login failed. Please try again.");
      } else {
        // Verify the logged-in user matches the selected role
        const user = result.user || result.data?.user;
        if (user && user.role !== selectedRole) {
          setLoginError(
            `This account is registered as ${user.role === "admin" ? "an Admin" : "an Employee"}. Please select the correct role and try again.`,
          );
          return;
        }

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
    <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
      <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] p-10 rounded-2xl shadow-2xl shadow-indigo-500/5 w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-15 -z-10"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-xl">
              <img
                src="/TeamFlow_logo.png"
                alt="TeamFlow"
                className="h-14 w-14 object-contain rounded-xl"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to TeamFlow
          </h1>
          <p className="text-zinc-400 mt-2 text-[15px]">
            Sign in to your account
          </p>
        </div>

        {/* ─── Role Toggle ─── */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            {ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                onClick={() => setSelectedRole(role.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedRole === role.key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {role.icon}
                {role.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-2">
            {ROLES.find((r) => r.key === selectedRole)?.subtitle}
          </p>
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

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5"
          noValidate
        >
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
              className={`w-full bg-white/[0.04] text-white outline-none border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/[0.08] focus:border-indigo-500"
              } py-4 px-5 rounded-xl placeholder:text-zinc-500 transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
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
                className={`w-full bg-white/[0.04] text-white outline-none border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/[0.08] focus:border-indigo-500"
                } py-4 px-5 pr-12 rounded-xl placeholder:text-zinc-500 transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 inline-block"
              aria-label="Forgot password? Click to reset"
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="relative mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isLoading}
            aria-label={
              isSubmitting ? "Signing in..." : `Sign in as ${selectedRole}`
            }
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
                `Sign In as ${selectedRole === "admin" ? "Admin" : "Employee"}`
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </form>

        {/* Bottom link — changes based on role */}
        <div className="text-center mt-8">
          {selectedRole === "admin" ? (
            <p className="text-zinc-400 text-[15px]">
              Don't have an account?{" "}
              <Link
                to="/register-company"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200 inline-block"
                aria-label="Register as admin"
              >
                Register as Admin
              </Link>
            </p>
          ) : (
            <p className="text-zinc-500 text-sm">
              Employee accounts are created by your company admin.
              <br />
              <span className="text-zinc-600">
                Contact your admin if you don't have credentials.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
