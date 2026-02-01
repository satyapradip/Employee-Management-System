import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { useToastContext } from "../../../context/toastContext.js";

/**
 * Task status mapping between backend and frontend
 */
const STATUS_MAP = {
  new: "pending",
  active: "in-progress",
  completed: "completed",
  failed: "failed",
};

/**
 * Transform backend task to frontend format
 */
const transformTask = (task) => ({
  id: task._id,
  _id: task._id,
  title: task.title,
  description: task.description,
  date: task.dueDate?.split("T")[0] || "",
  dueDate: task.dueDate,
  category: task.category,
  assignedTo: task.assignedTo?.name || "Unassigned",
  assignedToId: task.assignedTo?._id || task.assignedTo,
  assignedBy: task.assignedBy?.name || "",
  status: STATUS_MAP[task.status] || task.status,
  priority: task.priority || "medium",
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

/**
 * Custom Hook: useTaskManager
 * Production-grade task management with API integration
 *
 * LEARNING NOTES:
 * This is a CUSTOM HOOK - reusable logic for managing tasks
 * Study this to understand: useState, useEffect, useCallback, useMemo
 *
 * Features:
 * - Async data fetching with loading states
 * - Optimistic updates for better UX
 * - Error handling with rollback
 * - Memoized filtering and stats
 */
export const useTaskManager = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Why useState? To track data that changes and triggers re-renders

  // tasks: Array of all tasks from backend
  const [tasks, setTasks] = useState([]);

  // isLoading: Show spinner while fetching data initially
  const [isLoading, setIsLoading] = useState(true);

  // isSubmitting: Show loading state on buttons (create/update/delete)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // error: Store error messages to display to user
  const [error, setError] = useState(null);

  // searchQuery: User's search input (e.g., "fix bug")
  const [searchQuery, setSearchQuery] = useState("");

  // activeFilter: Current filter selected (e.g., "completed", "pending")
  const [activeFilter, setActiveFilter] = useState("all");

  // Get showToast function from global toast context
  // This lets us show notifications anywhere in this hook
  const { showToast } = useToastContext();

  // ============================================
  // FETCH TASKS FROM API
  // ============================================

  // Why useCallback?
  // - Prevents function from being recreated on every render
  // - Only recreates if dependencies ([showToast]) change
  // - Important for performance and preventing infinite loops in useEffect
  const fetchTasks = useCallback(async () => {
    try {
      // STEP 1: Set loading state (shows spinner in UI)
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // STEP 2: Call API (goes to backend GET /api/tasks)
      const response = await api.tasks.getAll();

      // STEP 3: If successful, transform and store tasks
      if (response.success) {
        // Why transform? Backend format ≠ Frontend format
        // Backend: { _id, status: "new" }
        // Frontend: { id, status: "pending" }
        const transformedTasks = response.data.tasks.map(transformTask);
        setTasks(transformedTasks);
      }
    } catch (err) {
      // STEP 4: Handle errors gracefully
      setError(err.message || "Failed to fetch tasks");
      showToast(err.message || "Failed to fetch tasks", "error");
    } finally {
      // STEP 5: Always turn off loading, even if error occurred
      // finally = runs whether try succeeds or catch catches error
      setIsLoading(false);
    }
  }, [showToast]); // Dependency: only recreate if showToast changes

  // INTERVIEW QUESTION: "Why use useCallback here?"
  // ANSWER: To prevent infinite loops in useEffect and optimize performance

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ============================================
  // FILTERED TASKS (Memoized)
  // ============================================
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchLower) ||
        task.assignedTo.toLowerCase().includes(searchLower) ||
        task.category.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesFilter =
        activeFilter === "all" || task.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, activeFilter]);

  // ============================================
  // STATS (Memoized)
  // ============================================
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      pending: tasks.filter((t) => t.status === "pending").length,
      failed: tasks.filter((t) => t.status === "failed").length,
    };
  }, [tasks]);

  // ============================================
  // CREATE TASK
  // ============================================
  const addTask = useCallback(
    async (taskData) => {
      try {
        setIsSubmitting(true);
        setError(null);

        // Prepare API payload
        const payload = {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          priority: taskData.priority || "medium",
          assignedTo: taskData.assignedTo, // Employee ID
          dueDate: taskData.date,
        };

        const response = await api.tasks.create(payload);

        if (response.success) {
          // Add new task to state
          const newTask = transformTask(response.data.task);
          setTasks((prev) => [newTask, ...prev]);
          showToast("Task created successfully!", "success");
          return { success: true, task: newTask };
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to create task";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast],
  );

  // ============================================
  // UPDATE TASK
  // ============================================
  const updateTask = useCallback(
    async (taskId, updates) => {
      const previousTasks = [...tasks];

      try {
        setIsSubmitting(true);
        setError(null);

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId || task._id === taskId
              ? { ...task, ...updates }
              : task,
          ),
        );

        // Prepare API payload
        const payload = {
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(updates.category && { category: updates.category }),
          ...(updates.priority && { priority: updates.priority }),
          ...(updates.assignedTo && { assignedTo: updates.assignedTo }),
          ...(updates.date && { dueDate: updates.date }),
        };

        const response = await api.tasks.update(taskId, payload);

        if (response.success) {
          const updatedTask = transformTask(response.data.task);
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId || task._id === taskId ? updatedTask : task,
            ),
          );
          showToast("Task updated successfully!", "success");
          return { success: true, task: updatedTask };
        }
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        const errorMsg = err.message || "Failed to update task";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [tasks, showToast],
  );

  // ============================================
  // DELETE TASK
  // ============================================
  const deleteTask = useCallback(
    async (taskId) => {
      const previousTasks = [...tasks];

      try {
        setIsSubmitting(true);
        setError(null);

        // Optimistic delete
        setTasks((prev) =>
          prev.filter((task) => task.id !== taskId && task._id !== taskId),
        );

        const response = await api.tasks.delete(taskId);

        if (response.success) {
          showToast("Task deleted successfully!", "success");
          return { success: true };
        }
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        const errorMsg = err.message || "Failed to delete task";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [tasks, showToast],
  );

  // ============================================
  // REFRESH TASKS
  // ============================================
  const refreshTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ============================================
  // RETURN
  // ============================================
  return {
    // Data
    tasks,
    filteredTasks,
    stats,

    // Loading states
    isLoading,
    isSubmitting,
    error,

    // Search & Filter
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,

    // CRUD Operations
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
};

export default useTaskManager;
