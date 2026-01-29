import React, { useState } from "react";

/**
 * Get card styling based on task status
 */
const getTaskStyle = (task) => {
  if (task.completed) {
    return {
      bg: "bg-zinc-800/60",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      badgeText: "Completed",
      accent: "emerald",
    };
  }
  if (task.failed) {
    return {
      bg: "bg-zinc-800/60",
      border: "border-rose-500/30",
      badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      badgeText: "Failed",
      accent: "rose",
    };
  }
  if (task.newTask) {
    return {
      bg: "bg-zinc-800/60",
      border: "border-violet-500/30",
      badge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
      badgeText: "New",
      accent: "violet",
    };
  }
  if (task.active) {
    return {
      bg: "bg-zinc-800/60",
      border: "border-amber-500/30",
      badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      badgeText: "In Progress",
      accent: "amber",
    };
  }
  return {
    bg: "bg-zinc-800/60",
    border: "border-zinc-600/30",
    badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    badgeText: "Pending",
    accent: "zinc",
  };
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

/**
 * Task Card Component - Clean, accessible design with actions
 */
const TaskCard = ({
  task,
  index,
  onAcceptTask,
  onCompleteTask,
  onFailTask,
}) => {
  const style = getTaskStyle(task);
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
      alert("Please provide a reason");
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

  return (
    <>
      <div
        className={`
          shrink-0 h-56 w-75 p-4 rounded-xl
          ${style.bg} ${style.border}
          border
          hover:border-zinc-500/50
          transition-all duration-300 ease-out
          cursor-pointer group
          relative overflow-hidden
          animate-cardSlide
        `}
        style={{ animationDelay: `${index * 60}ms` }}
        role="article"
        aria-label={`Task: ${task.title}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span
            className={`
              text-xs font-medium px-2.5 py-1 rounded-md
              border ${style.badge}
            `}
          >
            {style.badgeText}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            {formatDate(task.date)}
          </span>
        </div>

        {/* Category */}
        <div className="mt-2">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            {task.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1 text-base font-semibold text-white leading-snug line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-sm mt-1.5 text-zinc-400 leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Action Buttons */}
        <div className="absolute bottom-3 left-4 right-4 flex gap-2">
          {task.newTask && (
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Accept this task"
            >
              {isLoading ? "..." : "Accept Task"}
            </button>
          )}
          {task.active && (
            <>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Mark task as completed"
              >
                {isLoading ? "..." : "Complete"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFailModal(true);
                }}
                disabled={isLoading}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Mark task as failed"
              >
                Fail
              </button>
            </>
          )}
          {(task.completed || task.failed) && (
            <span className="text-xs text-zinc-500 py-2">
              {task.completed ? "✓ Completed" : "✗ Failed"}
            </span>
          )}
        </div>
      </div>

      {/* Fail Modal */}
      {showFailModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setShowFailModal(false)}
          role="button"
          tabIndex={0}
          aria-label="Close fail modal"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowFailModal(false);
          }}
        >
          <div
            className="bg-zinc-800 p-6 rounded-xl w-full max-w-md mx-4 border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Why did this task fail?
            </h3>
            <textarea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-violet-500"
              rows={3}
              placeholder="Enter the reason..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFailModal(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFail}
                disabled={isLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Mark as Failed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Empty State Component
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
    <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
      <svg
        className="w-7 h-7 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-white mb-1">No Tasks Yet</h3>
    <p className="text-sm text-zinc-500 max-w-xs">
      Tasks will appear here once assigned by your admin.
    </p>
  </div>
);

/**
 * Task List Component
 * Displays employee tasks in a horizontal scrollable list
 */
const TaskList = ({ data, onAcceptTask, onCompleteTask, onFailTask }) => {
  const tasks = data?.tasks || [];

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">My Tasks</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md">
            {tasks.length}
          </span>
        </div>

        {tasks.length > 3 && (
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            Scroll for more
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Task Cards */}
      {tasks.length > 0 ? (
        <div
          className="
            py-2 -mx-2 px-2
            flex gap-4 overflow-x-auto
            scroll-smooth snap-x snap-mandatory
            scrollbar-none
          "
        >
          {tasks.map((task, index) => (
            <div key={task._id || index} className="snap-start">
              <TaskCard
                task={task}
                index={index}
                onAcceptTask={onAcceptTask}
                onCompleteTask={onCompleteTask}
                onFailTask={onFailTask}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-800/30">
          <EmptyState />
        </div>
      )}

      <style>{`
        /* Hide scrollbar */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes cardSlide {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-cardSlide {
          animation: cardSlide 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TaskList;
