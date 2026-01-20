import React from "react";

/**
 * Get card styling based on task status
 */
const getTaskStyle = (task) => {
  if (task.completed) {
    return {
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25 hover:shadow-emerald-500/50",
      badge: "bg-emerald-900/50 border-emerald-400/30",
      badgeText: "Completed",
    };
  }
  if (task.failed) {
    return {
      gradient: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/25 hover:shadow-rose-500/50",
      badge: "bg-rose-900/50 border-rose-400/30",
      badgeText: "Failed",
    };
  }
  if (task.newTask) {
    return {
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/25 hover:shadow-blue-500/50",
      badge: "bg-blue-900/50 border-blue-400/30",
      badgeText: "New",
    };
  }
  if (task.active) {
    return {
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25 hover:shadow-amber-500/50",
      badge: "bg-amber-900/50 border-amber-400/30",
      badgeText: "In Progress",
    };
  }
  return {
    gradient: "from-slate-500 to-gray-600",
    shadow: "shadow-slate-500/25 hover:shadow-slate-500/50",
    badge: "bg-slate-900/50 border-slate-400/30",
    badgeText: "Pending",
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
    year: "numeric",
  });
};

/**
 * Task Card Component
 */
const TaskCard = ({ task, index }) => {
  const style = getTaskStyle(task);

  return (
    <div
      className={`
        shrink-0 h-56 w-[320px] p-5 rounded-2xl
        bg-linear-to-br ${style.gradient}
        shadow-lg ${style.shadow}
        hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-3
        transition-all duration-500 ease-out
        cursor-pointer border border-white/10
        backdrop-blur-sm group
        relative overflow-hidden
        animate-cardSlide
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/10 rounded-full blur-xl" />

      {/* Header */}
      <div className="relative flex justify-between items-center">
        <span
          className={`
            text-xs font-semibold backdrop-blur-sm px-3 py-1.5 rounded-full
            border ${style.badge}
            group-hover:scale-105 transition-transform duration-300
          `}
        >
          {style.badgeText}
        </span>
        <span className="text-sm opacity-80 font-medium flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(task.date)}
        </span>
      </div>

      {/* Category Badge */}
      <div className="relative mt-3">
        <span className="text-xs font-medium opacity-70 uppercase tracking-wider">
          {task.category}
        </span>
      </div>

      {/* Title */}
      <h2 className="relative mt-2 text-lg font-bold leading-tight group-hover:text-white transition-colors line-clamp-2">
        {task.title}
      </h2>

      {/* Description */}
      <p className="relative text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      {/* Action hint on hover */}
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <span className="text-xs font-medium flex items-center gap-1">
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </span>
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fadeIn">
    <div className="w-20 h-20 rounded-full bg-zinc-700/50 flex items-center justify-center mb-4">
      <svg
        className="w-10 h-10 text-zinc-500"
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
    <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
    <p className="text-zinc-400 max-w-sm">
      You don't have any tasks assigned yet. Tasks will appear here once
      assigned by your admin.
    </p>
  </div>
);

/**
 * Task List Component
 * Displays employee tasks in a horizontal scrollable list
 */
const TaskList = ({ data }) => {
  const tasks = data?.tasks || [];

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </span>
            My Tasks
          </h2>
          <p className="text-zinc-400 mt-1 ml-13">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <span>Scroll to see more</span>
            <svg
              className="w-5 h-5 animate-bounce-x"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Task Cards */}
      {tasks.length > 0 ? (
        <div
          className="
            py-4 -mx-2 px-2
            flex gap-5 overflow-x-auto
            scroll-smooth snap-x snap-mandatory
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-white/5
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-white/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-white/30
          "
        >
          {tasks.map((task, index) => (
            <div key={index} className="snap-start">
              <TaskCard task={task} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <style>{`
        @keyframes cardSlide {
          from {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-cardSlide {
          animation: cardSlide 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default TaskList;
