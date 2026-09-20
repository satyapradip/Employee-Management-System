import React, { useMemo, useState, useEffect } from "react";
import Header from "../others/Header";
import TaskListNumber from "../others/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import api from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth";
import useToast from "../../hooks/useToast.js";
import logger from "../../utils/logger.js";
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

/**
 * Modernized Welcome Banner Component
 */
const WelcomeBanner = ({ name }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className="mb-6 animate-fadeIn">
      <div className="relative overflow-hidden glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {greeting}
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back,{" "}
              <span className="text-gradient-accent">{name || "Employee"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Here is your personal deliverable queue and sprint velocity.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Today
              </span>
              <span className="block text-xs font-semibold text-white">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Next Best Action Component - Focuses Employee on Most Immediate Deliverable
 */
const NextBestAction = ({ data, onAcceptTask }) => {
  const getNextAction = useMemo(() => {
    const tasks = data?.tasks || [];
    const newTasks = tasks.filter((t) => t.newTask);
    const activeTasks = tasks.filter((t) => t.active);

    if (newTasks.length > 0) {
      return {
        title: "Review & Accept Priority Task",
        description: `You have ${newTasks.length} new task${
          newTasks.length > 1 ? "s" : ""
        } awaiting acceptance in your queue.`,
        actionLabel: "Accept First Task",
        taskId: newTasks[0]?._id,
        icon: Sparkles,
        color: "violet",
        taskTitle: newTasks[0]?.title,
      };
    }

    if (activeTasks.length > 0) {
      return {
        title: "Focus on Active Execution",
        description: `You have ${activeTasks.length} task${
          activeTasks.length > 1 ? "s" : ""
        } currently in flight.`,
        actionLabel: null,
        taskId: null,
        icon: Clock,
        color: "amber",
        taskTitle: activeTasks[0]?.title,
      };
    }

    return {
      title: "Queue Clear — All Tasks Delivered!",
      description: "No pending tasks require immediate action. Outstanding execution!",
      actionLabel: null,
      taskId: null,
      icon: CheckCircle2,
      color: "emerald",
      taskTitle: null,
    };
  }, [data?.tasks]);

  const colorStyles = {
    violet: {
      bg: "bg-indigo-950/40",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      btn: "btn-primary-gradient",
    },
    amber: {
      bg: "bg-amber-950/30",
      border: "border-amber-500/30",
      text: "text-amber-400",
      btn: "bg-amber-600 hover:bg-amber-500 text-white",
    },
    emerald: {
      bg: "bg-emerald-950/30",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
  };

  const style = colorStyles[getNextAction.color] || colorStyles.violet;
  const Icon = getNextAction.icon;

  return (
    <div className="mb-6 animate-fadeIn">
      <div
        className={`glass-panel rounded-2xl border ${style.border} ${style.bg} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${style.text}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500">
              Recommended Next Action
            </span>
            <h3 className="font-display font-bold text-white text-base">
              {getNextAction.title}
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              {getNextAction.taskTitle ? (
                <>
                  Focus:{" "}
                  <span className={`${style.text} font-semibold`}>
                    &quot;{getNextAction.taskTitle}&quot;
                  </span>
                </>
              ) : (
                getNextAction.description
              )}
            </p>
          </div>
        </div>

        {getNextAction.actionLabel && getNextAction.taskId && (
          <button
            onClick={() => onAcceptTask(getNextAction.taskId)}
            className={`${style.btn} px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {getNextAction.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Main Employee Dashboard Component
 */
const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const showToast = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    new: 0,
    active: 0,
    completed: 0,
    failed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.tasks.getAll();
        if (response.success) {
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
        logger.error("Failed to fetch tasks:", err);
        showToast("Failed to load tasks", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [showToast]);

  const handleAcceptTask = async (taskId) => {
    try {
      const response = await api.tasks.accept(taskId);
      if (response.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, status: "active", active: true, newTask: false }
              : t
          )
        );
        setStats((prev) => ({
          ...prev,
          new: Math.max(0, prev.new - 1),
          active: prev.active + 1,
        }));
        showToast("Task accepted! Moved to In Progress.", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to accept task", "error");
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
              : t
          )
        );
        setStats((prev) => ({
          ...prev,
          active: Math.max(0, prev.active - 1),
          completed: prev.completed + 1,
        }));
        showToast("Deliverable completed successfully!", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to complete task", "error");
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
              : t
          )
        );
        setStats((prev) => ({
          ...prev,
          active: Math.max(0, prev.active - 1),
          failed: prev.failed + 1,
        }));
        showToast("Task flagged with blocker notification.", "warning");
      }
    } catch (err) {
      showToast(err.message || "Failed to report task failure", "error");
    }
  };

  const taskData = {
    tasks,
    stats,
    name: user?.name,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-sm font-medium">Loading workspace deliverables...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="glow-ambient-indigo top-[-100px] left-1/4 pointer-events-none" />
      <div className="glow-ambient-cyan bottom-[-50px] right-0 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
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
  );
};

export default EmployeeDashboard;
