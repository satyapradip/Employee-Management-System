/**
 * API Service Layer
 * Centralized API calls with Axios
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Handle 401 - Unauthorized
    if (response.status === 401) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (name, email, password) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(response);
    },

    getMe: async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    updateProfile: async (data) => {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    changePassword: async (currentPassword, newPassword) => {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return handleResponse(response);
    },

    forgotPassword: async (email) => {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    },

    verifyResetToken: async (token) => {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        headers: { "Content-Type": "application/json" },
      });
      return handleResponse(response);
    },

    resetPassword: async (token, password) => {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      return handleResponse(response);
    },
  },

  // ============================================
  // TASKS
  // ============================================
  tasks: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/tasks?${params}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getOne: async (id) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    create: async (taskData) => {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(response);
    },

    update: async (id, taskData) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    accept: async (id) => {
      const response = await fetch(`${API_URL}/tasks/${id}/accept`, {
        method: "PUT",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    complete: async (id, notes = "") => {
      const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      });
      return handleResponse(response);
    },

    fail: async (id, reason) => {
      const response = await fetch(`${API_URL}/tasks/${id}/fail`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      return handleResponse(response);
    },

    getStats: async () => {
      const response = await fetch(`${API_URL}/tasks/stats`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ============================================
  // EMPLOYEES
  // ============================================
  employees: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/employees?${params}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    getOne: async (id) => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    create: async (employeeData) => {
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(employeeData),
      });
      return handleResponse(response);
    },

    update: async (id, employeeData) => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(employeeData),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    resetPassword: async (id, newPassword) => {
      const response = await fetch(
        `${API_URL}/employees/${id}/reset-password`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ newPassword }),
        },
      );
      return handleResponse(response);
    },

    getDashboardStats: async () => {
      const response = await fetch(`${API_URL}/employees/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },
};

export default api;
