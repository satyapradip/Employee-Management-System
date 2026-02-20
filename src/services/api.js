/**
 * API Service Layer
 * Centralized API calls with fetch API
 * Production-grade with request cancellation and error handling
 */
import logger from "../utils/logger.js";

// Validate and get API URL
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Warn in development if using default
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    logger.warn(
      "VITE_API_URL not set, using default: http://localhost:5000/api",
    );
  }

  // Error in production if not set
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    logger.error("VITE_API_URL is required in production! API calls may fail.");
  }

  return apiUrl;
};

const API_URL = getApiUrl();

// Flag to prevent auto-redirect during manual logout
let isLoggingOut = false;

// Store active requests for cancellation
const activeRequests = new Map();

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.token;
  }
  return null;
};

/**
 * Create headers with auth token
 */
const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Custom API Error with validation details
 */
class ApiError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Handle API response
 */
const handleResponse = async (response, requestId) => {
  // Remove from active requests
  if (requestId) {
    activeRequests.delete(requestId);
  }

  // Try to parse JSON, but handle non-JSON responses gracefully
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    // If JSON parsing fails, create a fallback error object
    data = {
      success: false,
      message:
        response.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : `Server error (${response.status})`,
    };
  }

  if (!response.ok) {
    // Handle 401 - Unauthorized
    // Only auto-redirect if user was already authenticated (has a stored session)
    // Do NOT redirect during login attempts (when no user is stored yet)
    const existingUser = localStorage.getItem("loggedInUser");
    if (response.status === 401 && !isLoggingOut && existingUser) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    }

    // Throw enhanced error with validation details
    const error = new ApiError(
      data.message || "Something went wrong",
      response.status,
      data.errors || [],
    );
    throw error;
  }

  return data;
};

/**
 * Create fetch request with AbortController
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise with abort capability
 */
const createRequest = (url, options = {}) => {
  const requestId = `${Date.now()}-${Math.random()}`;
  const controller = new AbortController();

  // Store controller for cancellation
  activeRequests.set(requestId, controller);

  const fetchOptions = {
    ...options,
    signal: controller.signal,
  };

  const request = fetch(url, fetchOptions)
    .then((response) => handleResponse(response, requestId))
    .catch((error) => {
      // Remove from active requests on error
      activeRequests.delete(requestId);

      // Don't throw if request was aborted
      if (error.name === "AbortError") {
        throw new Error("Request cancelled");
      }
      throw error;
    });

  // Add abort method
  request.abort = () => {
    controller.abort();
    activeRequests.delete(requestId);
  };

  return request;
};

/**
 * Cancel all active requests
 */
export const cancelAllRequests = () => {
  activeRequests.forEach((controller) => {
    controller.abort();
  });
  activeRequests.clear();
};

/**
 * API Methods
 */
const api = {
  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: async (email, password) => {
      return createRequest(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (name, email, password) => {
      return createRequest(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
    },

    registerAdmin: async (data) => {
      return createRequest(`${API_URL}/auth/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },

    getMe: async () => {
      return createRequest(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
    },

    updateProfile: async (data) => {
      return createRequest(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
    },

    changePassword: async (currentPassword, newPassword) => {
      return createRequest(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },

    forgotPassword: async (email) => {
      return createRequest(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    },

    verifyResetToken: async (token) => {
      return createRequest(`${API_URL}/auth/reset-password/${token}`, {
        headers: { "Content-Type": "application/json" },
      });
    },

    resetPassword: async (token, password) => {
      return createRequest(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    },

    logout: async () => {
      // Set flag to prevent race condition with 401 handler
      isLoggingOut = true;
      try {
        // Don't use createRequest for logout - we want it to always succeed
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: getHeaders(),
        });
        // Don't throw on error - logout should always succeed client-side
        return handleResponse(response, null).catch(() => ({ success: true }));
      } catch (error) {
        // Always succeed logout on client even if server call fails
        logger.warn(
          "Logout API call failed, but proceeding with client logout:",
          error,
        );
        return { success: true };
      } finally {
        // Reset flag after a delay to allow cleanup
        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    },
  },

  // ============================================
  // TASKS
  // ============================================
  tasks: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return createRequest(`${API_URL}/tasks?${params}`, {
        headers: getHeaders(),
      });
    },

    getOne: async (id) => {
      return createRequest(`${API_URL}/tasks/${id}`, {
        headers: getHeaders(),
      });
    },

    create: async (taskData) => {
      return createRequest(`${API_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
    },

    update: async (id, taskData) => {
      return createRequest(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
    },

    delete: async (id) => {
      return createRequest(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    },

    accept: async (id) => {
      return createRequest(`${API_URL}/tasks/${id}/accept`, {
        method: "PUT",
        headers: getHeaders(),
      });
    },

    complete: async (id, notes = "") => {
      return createRequest(`${API_URL}/tasks/${id}/complete`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      });
    },

    fail: async (id, reason) => {
      return createRequest(`${API_URL}/tasks/${id}/fail`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
    },

    getStats: async () => {
      return createRequest(`${API_URL}/tasks/stats`, {
        headers: getHeaders(),
      });
    },
  },

  // ============================================
  // EMPLOYEES
  // ============================================
  employees: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return createRequest(`${API_URL}/employees?${params}`, {
        headers: getHeaders(),
      });
    },

    getOne: async (id) => {
      return createRequest(`${API_URL}/employees/${id}`, {
        headers: getHeaders(),
      });
    },

    create: async (employeeData) => {
      return createRequest(`${API_URL}/employees`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(employeeData),
      });
    },

    update: async (id, employeeData) => {
      return createRequest(`${API_URL}/employees/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(employeeData),
      });
    },

    delete: async (id) => {
      return createRequest(`${API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    },

    resetPassword: async (id, newPassword) => {
      return createRequest(`${API_URL}/employees/${id}/reset-password`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ newPassword }),
      });
    },

    getDashboardStats: async () => {
      return createRequest(`${API_URL}/employees/dashboard`, {
        headers: getHeaders(),
      });
    },
  },
};

export default api;
