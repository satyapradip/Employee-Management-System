import React, { useState, useEffect } from "react";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import { useAuth } from "./hooks/useAuth.js";
import useToast from "./hooks/useToast.js";
import logger from "./utils/logger.js";
import RouteErrorBoundary from "./components/ErrorBoundary/RouteErrorBoundary.jsx";


/**
 * Auth Views
 */
const AUTH_VIEWS = {
  LOGIN: "login",
  SIGNUP: "signup",
  FORGOT_PASSWORD: "forgot_password",
  RESET_PASSWORD: "reset_password",
};

/**
 * App Component
 * Main application router based on authentication state
 * Uses AuthProvider context for all auth logic
 */
const App = () => {
  const { user, isAuthenticated, isLoading, error, clearError } = useAuth();
  const showToast = useToast();
  const [authView, setAuthView] = useState(AUTH_VIEWS.LOGIN);
  const [resetToken, setResetToken] = useState(null);

  // Check for reset password token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const action = urlParams.get("action");

    if (token && action === "reset-password") {
      setResetToken(token);
      setAuthView(AUTH_VIEWS.RESET_PASSWORD);
      // Clean URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Reset to login view when authentication state changes
  useEffect(() => {
    // Always reset to login view when auth state changes (login or logout)
    setAuthView(AUTH_VIEWS.LOGIN);
    setResetToken(null);
  }, [isAuthenticated]);

  // Show error toast when there's an auth error
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      // Auto-dismiss error after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, showToast]);

  // Show loading state while checking session
  if (isLoading) {
    logger.log("🔄 App: isLoading = true");
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Handle edge case: authenticated but no user data yet (shouldn't happen, but safety check)
  if (isAuthenticated && !user) {
    logger.warn("⚠️ App: isAuthenticated but no user data");
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading user data...</div>
        </div>
      </div>
    );
  }

  // Debug: Log current state (only in development)
  logger.debug("🎯 App render state:", {
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    userEmail: user?.email,
    userId: user?._id || user?.id,
  });

  // Render auth views when not authenticated
  const renderAuthView = () => {
    switch (authView) {
      case AUTH_VIEWS.SIGNUP:
        return (
          <Signup onBackToLogin={() => setAuthView(AUTH_VIEWS.LOGIN)} />
        );
      case AUTH_VIEWS.FORGOT_PASSWORD:
        return <ForgotPassword onBack={() => setAuthView(AUTH_VIEWS.LOGIN)} />;
      case AUTH_VIEWS.RESET_PASSWORD:
        return (
          <ResetPassword
            token={resetToken}
            onBackToLogin={() => {
              setResetToken(null);
              setAuthView(AUTH_VIEWS.LOGIN);
            }}
            onSuccess={() => {
              setResetToken(null);
              setAuthView(AUTH_VIEWS.LOGIN);
            }}
          />
        );
      default:
        return (
          <Login
            onSignup={() => setAuthView(AUTH_VIEWS.SIGNUP)}
            onForgotPassword={() => setAuthView(AUTH_VIEWS.FORGOT_PASSWORD)}
          />
        );
    }
  };

  return (
    <>
      {/* If NOT logged in → Show Auth Views */}
      {!isAuthenticated && (
        <RouteErrorBoundary fallbackMessage="An error occurred in the authentication section.">
          {renderAuthView()}
        </RouteErrorBoundary>
      )}
      {/* If logged in as ADMIN → Show Admin Dashboard */}
      {isAuthenticated && user && user.role === "admin" && (
        <RouteErrorBoundary
          fallbackMessage="An error occurred in the admin dashboard."
          showDetails={true}
        >
          <AdminDashboard />
        </RouteErrorBoundary>
      )}
      {/* If logged in as EMPLOYEE → Show Employee Dashboard */}
      {isAuthenticated && user && user.role === "employee" && (
        <RouteErrorBoundary
          fallbackMessage="An error occurred in the employee dashboard."
          showDetails={true}
        >
          <EmployeeDashboard />
        </RouteErrorBoundary>
      )}
      {/* Safety fallback - if authenticated but no role matches, show helpful error */}
      {isAuthenticated && user && user.role !== "admin" && user.role !== "employee" && (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-center p-8 bg-zinc-900/80 rounded-2xl border border-red-500/50 max-w-md">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Access Error</h1>
            <p className="text-gray-300 mb-2">
              Invalid user role detected: <span className="font-mono text-yellow-400">{user.role || "undefined"}</span>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Please contact support or try logging out and back in.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("loggedInUser");
                window.location.reload();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Clear session and reload page"
            >
              Clear Session & Reload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
