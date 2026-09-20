import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Sparkles,
  Clock,
  X,
  Send,
} from "lucide-react";

/**
 * Format date helper
 */
const formatDate = (dateString) => {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

/**
 * Modern Task Card for Employee Workspace
 */
const TaskCard = ({
  task,
  index,
  onAcceptTask,
  onCompleteTask,
  onFailTask,
}) => {
  const [showFailModal, setShowFailModal] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (onAcceptTask) {
      setIsLoading(true);
      await onAcceptTask(task._id);
      setIsLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.stopPropagation();
    if (onCompleteTask) {
      setIsLoading(true);
      await onCompleteTask(task._id);
      setIsLoading(false);
    }
  };

  const handleFail = async (e) => {
    e.stopPropagation();
    if (!failReason.trim()) {
      alert("Please provide a brief reason for flagging this deliverable as blocked/failed.");
      return;
    }
    if (onFailTask) {
      setIsLoading(true);
      await onFailTask(task._id, failReason);
      setIsLoading(false);
      setShowFailModal(false);
      setFailReason("");
    }
  };

  // Status Badge configurations
  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    if (task.failed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertCircle className="w-3.5 h-3.5" />
          Blocked
        </span>
      );
    }
    if (task.active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <PlayCircle className="w-3.5 h-3.5 animate-pulse" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30">
        <Sparkles className="w-3.5 h-3.5" />
        New Assignment
      </span>
    );
  };

  return (
    <>
      <div
        className="glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
        style={{ animationDelay: `${index * 40}ms` }}
        role="article"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {getStatusBadge()}
            <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatDate(task.date)}</span>
            </div>
          </div>

          {/* Category Tag */}
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            {task.category || "General"}
          </div>

          {/* Task Title */}
          <h3 className="font-display font-semibold text-white text-base leading-snug mb-2">
            {task.title}
          </h3>

          {/* Task Description */}
          <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-5">
            {task.description}
          </p>
        </div>

        {/* Card Action Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
          {task.newTask && (
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full btn-primary-gradient py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/25"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLoading ? "Accepting..." : "Accept Task"}
            </button>
          )}

          {task.active && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLoading ? "..." : "Complete"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFailModal(true);
                }}
                disabled={isLoading}
                className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Report Blocked
              </button>
            </div>
          )}

          {(task.completed || task.failed) && (
            <div className="w-full text-center py-1.5 text-xs font-medium text-zinc-500">
              {task.completed
                ? "✓ Archived as Completed"
                : "✗ Flagged with Blocker Note"}
            </div>
          )}
        </div>
      </div>

      {/* Blocked / Failure Reason Modal */}
      {showFailModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowFailModal(false)}
        >
          <div
            className="glass-panel bg-[#0d1326] border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  Report Task Blocker / Failure
                </h3>
              </div>
              <button
                onClick={() => setShowFailModal(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Describe what is blocking this task so your administrator can assist.
            </p>

            <textarea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-xs leading-relaxed resize-none h-24"
              placeholder="e.g. Awaiting API credentials from third-party payment vendor..."
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFailModal(false)}
                className="flex-1 py-2.5 rounded-xl btn-secondary-ghost text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFail}
                disabled={isLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isLoading ? "Submitting..." : "Submit Blocker"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Main Task List Component
 */
const TaskList = ({ data, onAcceptTask, onCompleteTask, onFailTask }) => {
  const [filter, setFilter] = useState("all");
  const tasks = data?.tasks || [];

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "new") return t.newTask;
    if (filter === "active") return t.active;
    if (filter === "completed") return t.completed;
    if (filter === "failed") return t.failed;
    return true;
  });

  const filterCounts = {
    all: tasks.length,
    new: tasks.filter((t) => t.newTask).length,
    active: tasks.filter((t) => t.active).length,
    completed: tasks.filter((t) => t.completed).length,
    failed: tasks.filter((t) => t.failed).length,
  };

  return (
    <div className="mt-8 space-y-5">
      {/* Section Header with Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Assigned Deliverables
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your personal task queue and update progress
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: "all", label: "All Tasks" },
            { key: "new", label: "New" },
            { key: "active", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "failed", label: "Blocked" },
          ].map((f) => {
            const isSelected = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                    : "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {f.label}{" "}
                <span className="ml-1 opacity-70 font-mono text-[10px]">
                  ({filterCounts[f.key]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Task Cards */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, index) => (
            <TaskCard
              key={task._id || index}
              task={task}
              index={index}
              onAcceptTask={onAcceptTask}
              onCompleteTask={onCompleteTask}
              onFailTask={onFailTask}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-white text-base mb-1">
            No tasks found in this view
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {filter === "all"
              ? "Your administrator has not assigned any deliverables to your queue yet."
              : `No tasks currently match the "${filter}" filter.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
