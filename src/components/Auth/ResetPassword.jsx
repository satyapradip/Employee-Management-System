import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

/**
 * ResetPassword Component
 * Allows users to set a new password using reset token
 */
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    console.log(
      "🔐 ResetPassword component mounted with token:",
      token?.substring(0, 10) + "...",
    );

    const verifyToken = async () => {
      try {
        console.log("⏳ Verifying token with backend...");
        const response = await api.auth.verifyResetToken(token);
        console.log("✅ Token verification response:", response);

        if (response.success && response.data.valid) {
          setIsValid(true);
          setEmail(response.data.email);
          console.log("✅ Token is valid for email:", response.data.email);
        }
      } catch (err) {
        console.error("❌ Token verification failed:", err);
        setError(err.message || "Invalid or expired reset link");
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      console.error("❌ No reset token provided to component!");
      setIsVerifying(false);
      setError("No reset token provided");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.auth.resetPassword(token, password);
      if (response.success) {
        setSuccess(true);

        console.log("✅ Password reset successful! Response:", response.data);

        // Save auth token and user data to localStorage for auto-login
        if (response.data.token && response.data.user) {
          console.log("💾 Saving user data and token for auto-login...");

          // Save user data to localStorage (same as login does)
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify(response.data.user),
          );

          // Wait 2 seconds to show success message, then reload to trigger auto-login
          setTimeout(() => {
            console.log("🔄 Reloading to trigger auto-login...");
            window.location.reload();
          }, 2000);
        } else {
          // Fallback: No auto-login, just go to login page
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Verifying reset link...</div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValid && !success) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
        <div className="relative backdrop-blur-xl bg-white/[0.03] border border-red-500/30 p-10 rounded-2xl shadow-2xl shadow-red-500/5 w-full max-w-md mx-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-20 -z-10"></div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
            <p className="text-gray-400 mb-6">
              {error || "This password reset link is invalid or has expired."}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Please request a new password reset link.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
        <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] p-10 rounded-2xl shadow-2xl shadow-indigo-500/5 w-full max-w-md mx-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-15 -z-10"></div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-400 mb-4">
              Your password has been changed successfully.
            </p>
            <p className="text-indigo-400 text-sm">
              Redirecting to dashboard...
            </p>
            <div className="mt-4">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#09090b]">
      <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] p-10 rounded-2xl shadow-2xl shadow-indigo-500/5 w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-15 -z-10"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-indigo-500/15 rounded-full flex items-center justify-center">
              <svg
                className="w-7 h-7 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">
            Enter a new password for{" "}
            <span className="text-indigo-400">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
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
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-white/[0.04] text-white outline-none border border-white/[0.08] focus:border-indigo-500 py-4 px-5 rounded-xl placeholder:text-zinc-500 transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 disabled:opacity-50"
              type="password"
              placeholder="New password (min 6 characters)"
              minLength={6}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="relative group">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-white/[0.04] text-white outline-none border border-white/[0.08] focus:border-indigo-500 py-4 px-5 rounded-xl placeholder:text-zinc-500 transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 disabled:opacity-50"
              type="password"
              placeholder="Confirm new password"
              minLength={6}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Password match indicator */}
          {confirmPassword && (
            <div
              className={`flex items-center gap-2 text-sm ${
                password === confirmPassword
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
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
                  d={
                    password === confirmPassword
                      ? "M5 13l4 4L19 7"
                      : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  }
                />
              </svg>
              {password === confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </div>
          )}

          <button
            className="relative mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            type="submit"
            disabled={isSubmitting || password !== confirmPassword}
            aria-label={
              isSubmitting ? "Resetting password..." : "Reset password"
            }
            aria-busy={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Reset Password
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-zinc-400 hover:text-indigo-400 font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer bg-transparent border-none"
          aria-label="Go back to login"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
