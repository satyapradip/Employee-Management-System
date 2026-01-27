import React, { useState, useEffect } from "react";
import Login from "./components/Auth/Login.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import { useAuth } from "./hooks/useAuth.js";
// Development demo toast (lazy import placeholder)
const DemoToastPlaceholder = React.lazy(() => import("./components/DemoToastButton.jsx"));

/**
 * Auth Views
 */
const AUTH_VIEWS = {
  LOGIN: "login",
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

  // Auto-dismiss error toast after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Show loading state while checking session
  if (isLoading) {
    console.log("🔄 App: isLoading = true");
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
    console.log("⚠️ App: isAuthenticated but no user data");
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading user data...</div>
        </div>
      </div>
    );
  }

  // Debug: Log current state
  console.log("🎯 App render state:", {
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
  });

  // Render auth views when not authenticated
  const renderAuthView = () => {
    switch (authView) {
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
            onForgotPassword={() => setAuthView(AUTH_VIEWS.FORGOT_PASSWORD)}
          />
        );
    }
  };

  return (
    <>
      {/* If NOT logged in → Show Auth Views */}
      {!isAuthenticated && (
        <>
          {renderAuthView()}
          {/* Show error toast if there's a session error */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-amber-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
              <div className="flex items-center gap-2">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="flex-1">{error}</span>
                <button
                  onClick={clearError}
                  className="ml-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
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
            </div>
          )}
        </>
      )}
      {/* If logged in as ADMIN → Show Admin Dashboard */}
      {isAuthenticated && user && user.role === "admin" && <AdminDashboard />}
      {/* If logged in as EMPLOYEE → Show Employee Dashboard */}
      {isAuthenticated && user && user.role === "employee" && (
        <EmployeeDashboard />
      )}
      {/* Safety fallback - if authenticated but no role matches, show error */}
      {isAuthenticated && user && !user.role && (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-white text-lg">Invalid user role</div>
        </div>
      )}
      {/* Development-only demo toast buttons */}
      {process.env.NODE_ENV === "development" && (
        <React.Suspense fallback={null}>
          {/* Lazy-load demo button to avoid shipping to production */}
          <DemoToastPlaceholder />
        </React.Suspense>
      )}
    </>
  );
};

export default App;
