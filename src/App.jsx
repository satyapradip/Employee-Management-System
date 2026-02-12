import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { useAuth } from "./hooks/useAuth.js";
import useToast from "./hooks/useToast.js";
import logger from "./utils/logger.js";
import RouteErrorBoundary from "./components/ErrorBoundary/RouteErrorBoundary.jsx";

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "employee") {
      return <Navigate to="/employee" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Auth Route Component
 * Redirects to dashboard if already authenticated
 */
const AuthRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
  const lastErrorRef = useRef(null);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      showToast(error, "error");
      const timer = setTimeout(() => {
        clearError();
        lastErrorRef.current = null;
      }, 5000);
      return () => clearTimeout(timer);
    } else if (!error) {
      lastErrorRef.current = null;
    }
  }, [error, clearError, showToast]);

  // Check for reset password token in URL and redirect
  useEffect(() => {
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (token && action === "reset-password") {
      navigate(`/reset-password?token=${token}`);
    }
  }, [searchParams, navigate]);

  // Debug: Log current state (only in development)
  logger.debug("🎯 App render state:", {
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    userEmail: user?.email,
    userId: user?._id || user?.id,
  });

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <RouteErrorBoundary fallbackMessage="An error occurred in the authentication section.">
              <Login />
            </RouteErrorBoundary>
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <RouteErrorBoundary fallbackMessage="An error occurred in the signup section.">
              <Signup />
            </RouteErrorBoundary>
          </AuthRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <RouteErrorBoundary fallbackMessage="An error occurred in password recovery.">
              <ForgotPassword />
            </RouteErrorBoundary>
          </AuthRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <RouteErrorBoundary fallbackMessage="An error occurred in password reset.">
            <ResetPassword />
          </RouteErrorBoundary>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <RouteErrorBoundary
              fallbackMessage="An error occurred in the admin dashboard."
              showDetails={true}
            >
              <AdminDashboard />
            </RouteErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <RouteErrorBoundary
              fallbackMessage="An error occurred in the employee dashboard."
              showDetails={true}
            >
              <EmployeeDashboard />
            </RouteErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Fallback - redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes        </h1>
              <p className="text-gray-300 mb-2">
                Invalid user role detected:{" "}
                <span className="font-mono text-yellow-400">
                  {user.role || "undefined"}
                </span>
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
