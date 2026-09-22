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
 * Following Reference 1 clean light surface and pastel badges
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

  // Status Badge configurations (Reference 1 pastel colors)
  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (task.failed) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]">
          <AlertCircle className="w-3 h-3" />
          Blocked
        </span>
      );
    }
    if (task.active) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#3730A3] border border-[#E0E7FF]">
          <PlayCircle className="w-3 h-3" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
        <Sparkles className="w-3 h-3" />
        New Assignment
      </span>
    );
  };

  return (
    <>
      <div
        className="saas-card p-5 flex flex-col justify-between"
        style={{ animationDelay: `${index * 30}ms` }}
        role="article"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {getStatusBadge()}
            <div className="flex items-center gap-1 text-xs text-[#5E6875] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#87909B]" />
              <span>{formatDate(task.date)}</span>
            </div>
          </div>

          {/* Category Tag */}
          <div className="text-[11px] font-semibold text-[#87909B] uppercase tracking-wider mb-1">
            {task.category || "General"}
          </div>

          {/* Task Title */}
          <h3 className="font-display font-semibold text-[#15191E] text-base leading-snug mb-1.5">
            {task.title}
          </h3>

          {/* Task Description */}
          <p className="text-xs text-[#5E6875] leading-relaxed line-clamp-3 mb-5">
            {task.description}
          </p>
        </div>

        {/* Card Action Footer */}
        <div className="pt-3.5 border-t border-[#E1E5E9] flex items-center justify-between gap-2">
          {task.newTask && (
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? "Accepting..." : "Accept Task"}</span>
            </button>
          )}

          {task.active && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-[#15803D] hover:bg-[#166534] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isLoading ? "..." : "Complete"}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFailModal(true);
                }}
                disabled={isLoading}
                className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#B91C1C] border border-[#FECACA] py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Report Blocked
              </button>
            </div>
          )}

          {(task.completed || task.failed) && (
            <div className="w-full text-center py-1 text-xs font-medium text-[#87909B]">
              {task.completed
                ? "✓ Resolved as Completed"
                : "✗ Flagged with Blocker"}
            </div>
          )}
        </div>
      </div>

      {/* Blocked / Failure Reason Modal */}
      {showFailModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setShowFailModal(false)}
        >
          <div
            className="bg-white border border-[#E1E5E9] rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center text-[#B91C1C]">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-[#15191E]">
                  Report Deliverable Blocker
                </h3>
              </div>
              <button
                onClick={() => setShowFailModal(false)}
                className="p-1 text-[#87909B] hover:text-[#15191E] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5E6875] mb-3">
              Describe what is blocking this deliverable so your administrator can take action.
            </p>

            <textarea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl p-3 text-xs leading-relaxed resize-none h-24 text-[#15191E] placeholder:text-[#87909B]"
              placeholder="e.g. Awaiting API credentials from payment gateway provider..."
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFailModal(false)}
                className="flex-1 py-2.5 btn-secondary rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFail}
                disabled={isLoading}
                className="flex-1 bg-[#B91C1C] hover:bg-[#991B1B] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? "Submitting..." : "Submit Blocker"}</span>
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
          <h2 className="font-display font-bold text-lg text-[#15191E]">
            Assigned Deliverables
          </h2>
          <p className="text-xs text-[#5E6875] mt-0.5">
            Manage your personal task queue and update progress
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#101827] text-white shadow-2xs"
                    : "bg-white text-[#5E6875] hover:text-[#15191E] border border-[#E1E5E9] hover:bg-[#F8FAFC]"
                }`}
              >
                {f.label}{" "}
                <span className={`ml-1 font-mono text-[10px] ${isSelected ? "text-zinc-300" : "text-[#87909B]"}`}>
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
        <div className="bg-white p-12 rounded-2xl border border-[#E1E5E9] text-center shadow-xs">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#F5F6F7] border border-[#E1E5E9] flex items-center justify-center text-[#87909B]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-[#15191E] text-base mb-1">
            No tasks found in this view
          </h3>
          <p className="text-xs text-[#5E6875] max-w-sm mx-auto">
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
