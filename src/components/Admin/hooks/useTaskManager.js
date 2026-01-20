import { useState, useMemo } from "react";
import { sampleTasks } from "../data/sampleTasks";

/**
 * Custom Hook: useTaskManager
 * Manages task state, filtering, and CRUD operations
 */
export const useTaskManager = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "all" || task.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, activeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      pending: tasks.filter((t) => t.status === "pending").length,
      failed: tasks.filter((t) => t.status === "failed").length,
    };
  }, [tasks]);

  // Add new task
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      status: "pending",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Update task
  const updateTask = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    );
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    addTask,
    updateTask,
    deleteTask,
  };
};

export default useTaskManager;
