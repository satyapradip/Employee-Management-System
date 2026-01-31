import React, { useMemo, useState, useEffect } from "react";
import Header from "../others/Header";
import TaskListNumber from "../others/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import api from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth";
import logger from "../../utils/logger.js";

/**
 * Welcome Banner Component - Compact version with better contrast
 */
const WelcomeBanner = ({ name }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div id="employeedashboard" className="mb-6 animate-slideDown">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-800/80 p-5 border border-zinc-700/50">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-0.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {greeting}
            </p>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back,{" "}
              <span className="text-violet-400">{name || "Employee"}</span>
            </h1>
          </div>

          {/* Compact Date Widget */}
          <div className="hidden md:flex items-center gap-3 text-zinc-400">
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-zinc-500">
                Today
              </span>
              <span className="block text-lg font-semibold text-white">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Next Best Action Component - Guides user workflow
 */
const NextBestAction = ({ data }) => {
  const getNextAction = useMemo(() => {
    const tasks = data?.tasks || [];
    const newTasks = tasks.filter((t) => t.newTask);
    const activeTasks = tasks.filter((t) => t.active);
    const urgentTask = tasks.find((t) => t.active || t.newTask);

    if (newTasks.length > 0) {
      return {
        title: "Review New Task",
        description: `You have ${newTasks.length} new task${newTasks.length > 1 ? "s" : ""} waiting for your attention`,
        action: "Accept Task",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        accentColor: "violet",
        taskTitle: newTasks[0]?.title,
      };
    }
    if (activeTasks.length > 0) {
      return {
        title: "Continue Working",
        description: `You have ${activeTasks.length} task${activeTasks.length > 1 ? "s" : ""} in progress`,
        action: "View Task",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        accentColor: "amber",
        taskTitle: activeTasks[0]?.title,
      };
    }
    return {
      title: "All Caught Up!",
      description: "No pending tasks. Enjoy your productivity streak!",
      action: null,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accentColor: "emerald",
      taskTitle: null,
    };
  }, [data?.tasks]);

  const colorMap = {
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      text: "text-violet-400",
      btn: "bg-violet-600 hover:bg-violet-500",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      btn: "bg-amber-600 hover:bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-500",
    },
  };
  const colors = colorMap[getNextAction.accentColor];

  return (
    <div className="mb-6 animate-fadeIn" style={{ animationDelay: "100ms" }}>
      <div
        className={`relative overflow-hidden rounded-xl ${colors.bg} border ${colors.border} p-4`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}
            >
              {getNextAction.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Next Action
                </span>
              </div>
              <h3 className="text-white font-medium">{getNextAction.title}</h3>
              <p className="text-sm text-zinc-400">
                {getNextAction.taskTitle ? (
                  <span className={colors.text}>
                    "{getNextAction.taskTitle}"
                  </span>
                ) : (
                  getNextAction.description
                )}
              </p>
            </div>
          </div>
          {getNextAction.action && (
            <button
              className={`${colors.btn} text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0`}
            >
              {getNextAction.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Employee Dashboard Component
 * Uses AuthContext for user data and logout
 */
const EmployeeDashboard = () => {
  // Get user and logout from AuthContext
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    new: 0,
    active: 0,
    completed: 0,
    failed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.tasks.getAll();
        if (response.success) {
          // Transform API tasks to match frontend format
          const transformedTasks = response.data.tasks.map((task) => ({
            ...task,
            newTask: task.status === "new",
            active: task.status === "active",
            completed: task.status === "completed",
            failed: task.status === "failed",
            date: task.dueDate,
          }));
          setTasks(transformedTasks);
          setStats(response.data.stats);
        }
      } catch (err) {
        setError(err.message);
        logger.error("Failed to fetch tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handle task actions
  const handleAcceptTask = async (taskId) => {
    try {
      const response = await api.tasks.accept(taskId);
      if (response.success) {
        // Update local state
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, status: "active", active: true, newTask: false }
              : t,
          ),
        );
        setStats((prev) => ({
          ...prev,
          new: prev.new - 1,
          active: prev.active + 1,
        }));
      }
    } catch (err) {
      alert(err.message || "Failed to accept task");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await api.tasks.complete(taskId);
      if (response.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, status: "completed", completed: true, active: false }
              : t,
          ),
        );
        setStats((prev) => ({
          ...prev,
          active: prev.active - 1,
          completed: prev.completed + 1,
        }));
      }
    } catch (err) {
      alert(err.message || "Failed to complete task");
    }
  };

  const handleFailTask = async (taskId, reason) => {
    try {
      const response = await api.tasks.fail(taskId, reason);
      if (response.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, status: "failed", failed: true, active: false }
              : t,
          ),
        );
        setStats((prev) => ({
          ...prev,
          active: prev.active - 1,
          failed: prev.failed + 1,
        }));
      }
    } catch (err) {
      alert(err.message || "Failed to mark task as failed");
    }
  };

  // Create taskData object for child components
  const taskData = {
    tasks,
    stats,
    name: user?.name,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />

      {/* Main content wrapper - removes right scrollbar */}
      <div className="relative z-10 h-screen overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="p-6 md:p-8 lg:px-12 text-white max-w-7xl mx-auto">
          <Header userName={user?.name || user?.email} onLogout={logout} />

          <WelcomeBanner name={user?.name} />

          <NextBestAction data={taskData} onAcceptTask={handleAcceptTask} />

          <TaskListNumber data={taskData} />

          <TaskList
            data={taskData}
            onAcceptTask={handleAcceptTask}
            onCompleteTask={handleCompleteTask}
            onFailTask={handleFailTask}
          />
        </div>
      </div>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
