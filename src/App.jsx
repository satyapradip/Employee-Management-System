import React, { useState, useEffect } from "react";
import Login from "./components/Auth/Login.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import { useAuth } from "./hooks/useAuth.js";

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
  const { user, isAuthenticated, isLoading, error } = useAuth();
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

  // Reset to login view when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setAuthView(AUTH_VIEWS.LOGIN);
      setResetToken(null);
    }
  }, [isAuthenticated]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Show session expired message if there's an error
  if (error && !isAuthenticated) {
    return (
      <>
        <Login
          onForgotPassword={() => setAuthView(AUTH_VIEWS.FORGOT_PASSWORD)}
        />
        {/* Toast notification for session expiry */}
        <div className="fixed bottom-4 right-4 bg-amber-500/90 text-white px-4 py-3 rounded-lg shadow-lg animate-slideUp z-50">
          <div className="flex items-center gap-2">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </>
    );
  }

  // Render auth views when not authenticated
  const renderAuthView = () => {
    switch (authView) {
      case AUTH_VIEWS.FORGOT_PASSWORD:
        return <ForgotPassword onBack={() => setAuthView(AUTH_VIEWS.LOGIN)} />;
      case AUTH_VIEWS.RESET_PASSWORD:
        return (
          <ResetPassword
            token={resetToken}
            onBack={() => {
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
      {!isAuthenticated && renderAuthView()}
      {/* If logged in as ADMIN → Show Admin Dashboard */}
      {isAuthenticated && user?.role === "admin" && <AdminDashboard />}
      {/* If logged in as EMPLOYEE → Show Employee Dashboard */}
      {isAuthenticated && user?.role === "employee" && <EmployeeDashboard />}
    </>
  );
};

export default App;
