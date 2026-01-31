import React, { useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { AuthContext } from "./contexts";
import api from "../services/api";
// import useToast from "../hooks/useToast";
import { useToastContext } from "../context/toastContext.js";
import logger from "../utils/logger.js";

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Token refresh threshold (5 minutes before expiry)
const REFRESH_THRESHOLD = 5 * 60 * 1000;
// Activity check interval (1 minute)
const ACTIVITY_CHECK_INTERVAL = 60 * 1000;

/**
 * AuthProvider - Manages authentication state, token refresh, and session timeout
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prefers direct context here so we can remove warning toasts by id
  const { showToast, removeToast } = useToastContext();

  // Ref to store warning toast id and its timer so we can clear it
  const warningToastRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // Refs for timers
  const sessionTimeoutRef = useRef(null);
  const activityTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // ============================================
  // LOGOUT FUNCTION (defined first to avoid circular dependency)
  // ============================================

  /**
   * Logout user and clear session
   */
  const logout = useCallback(
    (messageOrEvent = null) => {
      // Check if first argument is an event object (from onClick)
      // If so, ignore it. Only use actual string messages.
      const message =
        typeof messageOrEvent === "string" ? messageOrEvent : null;

      // Clear timeouts first to prevent any callbacks
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = null;
      }

      // Clear localStorage immediately
      localStorage.removeItem("loggedInUser");

      // Use flushSync to force immediate synchronous state updates
      // This prevents black screen by ensuring React re-renders immediately
      flushSync(() => {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        if (message) {
          setError(message);
        }
      });

      // Display a toast to inform user they have been logged out
      try {
        showToast(message || "You've been signed out", "info");
      } catch {
        // In case toast system is unavailable, silently ignore
      }

      // Call backend logout in background (don't wait for it)
      api.auth.logout().catch((err) => {
        logger.warn("Backend logout failed:", err);
      });
    },
    [showToast],
  );

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  /**
   * Reset session timeout on user activity
   */
  const resetSessionTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Set new timeout only if user is authenticated
    if (isAuthenticated) {
      // Clear previous warning timer and toast
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      if (warningToastRef.current) {
        try {
          removeToast(warningToastRef.current);
        } catch (err) {
          logger.warn("Failed to remove warning toast:", err);
        }
        warningToastRef.current = null;
      }

      // Schedule warning toast 1 minute before session expiry
      const warningBefore = 60 * 1000; // 1 minute
      if (SESSION_TIMEOUT > warningBefore) {
        warningTimeoutRef.current = setTimeout(() => {
          try {
            // show a persistent warning (duration = 0 -> stays until removed)
            const id = showToast({
              message: "Session expiring soon — click to stay signed in",
              type: "warning",
              duration: 0,
              action: {
                label: "Stay signed in",
                onClick: (toastId) => {
                  try {
                    // Extend session
                    resetSessionTimeout();
                    // Remove the warning toast
                    removeToast(toastId);
                    // Notify user
                    showToast("Session extended", "success");
                  } catch (err) {
                    logger.warn("Failed to remove warning toast:", err);
                  }
                },
              },
            });
            warningToastRef.current = id;
          } catch {
            /* ignore */
          }
        }, SESSION_TIMEOUT - warningBefore);
      }

      sessionTimeoutRef.current = setTimeout(() => {
        logger.log("⏰ Session expired due to inactivity");
        // Ensure warning toast is removed when session actually expires
        if (warningToastRef.current) {
          try {
            removeToast(warningToastRef.current);
          } catch (err) {
            logger.warn("Failed to remove warning toast:", err);
          }
          warningToastRef.current = null;
        }
        logout("Session expired due to inactivity");
      }, SESSION_TIMEOUT);
    }
  }, [isAuthenticated, logout, removeToast, showToast]);

  /**
   * Track user activity for session management
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

    const handleActivity = () => {
      resetSessionTimeout();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initial session timeout
    resetSessionTimeout();

    return () => {
      // Cleanup event listeners
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [isAuthenticated, resetSessionTimeout]);

  // ============================================
  // TOKEN REFRESH LOGIC
  // ============================================

  /**
   * Check if token needs refresh (based on JWT expiry)
   */
  const checkTokenExpiry = useCallback(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (!savedUser) return false;

    try {
      const { token } = JSON.parse(savedUser);
      if (!token) return false;

      // Decode JWT to get expiry (JWT is base64 encoded)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const timeUntilExpiry = expiryTime - Date.now();

      // Return true if token expires within threshold
      return timeUntilExpiry < REFRESH_THRESHOLD && timeUntilExpiry > 0;
    } catch {
      return false;
    }
  }, []);

  /**
   * Check if token is expired
   */
  const isTokenExpired = useCallback(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (!savedUser) return true;

    try {
      const { token } = JSON.parse(savedUser);
      if (!token) return true;

      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  /**
   * Periodic token check
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      // Check if token is expired
      if (isTokenExpired()) {
        logger.log("🔑 Token expired");
        logout("Session expired. Please login again.");
        return;
      }

      // Check if token needs refresh
      if (checkTokenExpiry()) {
        logger.debug("🔄 Token needs refresh");
        // In a real app, call refresh token endpoint here
        // For now, we'll just log it since we don't have a refresh endpoint
      }
    }, ACTIVITY_CHECK_INTERVAL);

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, checkTokenExpiry, isTokenExpired, logout]);

  // ============================================
  // INITIAL AUTH CHECK
  // ============================================

  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("loggedInUser");

      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);

          // Check if token is expired before making API call
          if (isTokenExpired()) {
            localStorage.removeItem("loggedInUser");
            if (isMounted) {
              setIsLoading(false);
            }
            return;
          }

          // Verify token is still valid by calling /me
          const response = await api.auth.getMe();

          // Only update state if component is still mounted
          if (isMounted) {
            // Helper to extract role from token
            const getRoleFromToken = (token) => {
              try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return payload.role;
              } catch {
                return null;
              }
            };

            // Ensure role is present - check user object first, then token as fallback
            const userRole =
              response.data.user?.role ||
              getRoleFromToken(parsed.token) ||
              "employee"; // Default fallback

            const userData = {
              ...response.data.user,
              role: userRole, // Explicitly set role
              token: parsed.token,
            };

            // Validate role
            if (!["admin", "employee"].includes(userData.role)) {
              logger.warn("Invalid role in stored session:", userData.role);
              localStorage.removeItem("loggedInUser");
              return;
            }

            logger.debug("Session restored:", {
              email: userData.email,
              role: userData.role,
            });

            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (err) {
          logger.error("Auth verification failed:", err.message);
          localStorage.removeItem("loggedInUser");
          // Don't update state if unmounted
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isTokenExpired]);

  // ============================================
  // AUTH ACTIONS
  // ============================================

  /**
   * Extract role from JWT token (fallback if user object doesn't have role)
   */
  const extractRoleFromToken = useCallback((token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return null;
    }
  }, []);

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.auth.register(name, email, password);

      if (response.success) {
        // Registration successful - user needs to login
        // Don't auto-login, let them use the login form
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.auth.login(email, password);

      if (response.success) {
        // Ensure role is present - check user object first, then token as fallback
        const userRole =
          response.data.user?.role ||
          extractRoleFromToken(response.data.token) ||
          "employee"; // Default fallback

        const userData = {
          ...response.data.user,
          role: userRole, // Explicitly set role
          token: response.data.token,
        };

        // Debug logging (development only)
        logger.debug("Login successful:", {
          email: userData.email,
          role: userData.role,
          hasToken: !!userData.token,
          userId: userData._id || userData.id,
        });

        // Validate role
        if (!["admin", "employee"].includes(userData.role)) {
          logger.warn("Invalid role detected:", userData.role);
          throw new Error("Invalid user role. Please contact support.");
        }

        // Save to state
        setUser(userData);
        setIsAuthenticated(true);

        // Save to localStorage for persistence
        localStorage.setItem("loggedInUser", JSON.stringify(userData));

        // Reset session timeout
        resetSessionTimeout();

        return { success: true, user: userData };
      }

      // If response.success is false but no error thrown
      return {
        success: false,
        error: response.message || "Login failed. Please try again.",
      };
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      logger.error("Login error:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data) => {
    try {
      const response = await api.auth.updateProfile(data);

      if (response.success) {
        const updatedUser = {
          ...user,
          ...response.data.user,
        };

        setUser(updatedUser);

        // Update localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.auth.changePassword(
        currentPassword,
        newPassword,
      );

      if (response.success) {
        // Update token if new one is returned
        if (response.data.token) {
          const updatedUser = {
            ...user,
            token: response.data.token,
          };
          setUser(updatedUser);
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        }

        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Clear any auth errors
   */
  const clearError = () => {
    setError(null);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,

    // Session info
    sessionTimeout: SESSION_TIMEOUT,
    lastActivity: lastActivityRef.current,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
