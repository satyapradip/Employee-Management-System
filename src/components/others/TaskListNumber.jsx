import React, { useMemo } from "react";

/**
 * Task Statistics Cards
 * Displays counts for different task statuses with visual hierarchy
 * Primary metric (Active) is highlighted, secondary metrics are more subtle
 */
const TaskListNumber = ({ data }) => {
  // Calculate task statistics from employee data
  const stats = useMemo(() => {
    if (!data?.tasks) {
      return { newTask: 0, active: 0, completed: 0, failed: 0, total: 0 };
    }

    const result = data.tasks.reduce(
      (acc, task) => {
        if (task.newTask) acc.newTask++;
        if (task.active) acc.active++;
        if (task.completed) acc.completed++;
        if (task.failed) acc.failed++;
        acc.total++;
        return acc;
      },
      { newTask: 0, active: 0, completed: 0, failed: 0, total: 0 },
    );
    return result;
  }, [data?.tasks]);

  // Primary metric - Active tasks (most actionable)
  const primaryMetric = {
    label: "In Progress",
    value: stats.active,
    subtext:
      stats.active === 1 ? "task needs attention" : "tasks need attention",
    color: "amber",
    icon: (
      <svg
        className="w-6 h-6"
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
  };

  // Secondary metrics - Less visual weight
  const secondaryMetrics = [
    {
      label: "New",
      value: stats.newTask,
      color: "violet",
      icon: (
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "emerald",
      icon: (
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
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Failed",
      value: stats.failed,
      color: "rose",
      icon: (
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
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      ),
    },
  ];

  const colorMap = {
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      accent: "bg-amber-500",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      text: "text-violet-400",
      accent: "bg-violet-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      accent: "bg-emerald-500",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
      accent: "bg-rose-500",
    },
  };

  return (
    <div className="mt-6 animate-fadeIn" style={{ animationDelay: "150ms" }}>
      {/* Section label */}
      <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
        Task Overview
      </h3>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Primary Metric Card - Larger and more prominent */}
        <div
          className={`
            relative flex-1 lg:flex-2 p-5 rounded-xl
            ${colorMap[primaryMetric.color].bg}
            border ${colorMap[primaryMetric.color].border}
            transition-all duration-300 hover:border-amber-500/50
          `}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${colorMap[primaryMetric.color].accent}`}
                />
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  {primaryMetric.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-4xl font-bold ${colorMap[primaryMetric.color].text}`}
                >
                  {primaryMetric.value}
                </span>
                <span className="text-sm text-zinc-500">
                  {primaryMetric.subtext}
                </span>
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg ${colorMap[primaryMetric.color].bg} ${colorMap[primaryMetric.color].text}`}
            >
              {primaryMetric.icon}
            </div>
          </div>

          {/* Progress indicator */}
          {stats.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>Progress</span>
                <span className="text-zinc-400">
                  {Math.round((stats.completed / stats.total) * 100)}% complete
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Secondary Metrics - Compact row */}
        <div className="flex lg:flex-col gap-3 flex-1">
          {secondaryMetrics.map((metric) => {
            const colors = colorMap[metric.color];
            return (
              <div
                key={metric.label}
                className={`
                  flex-1 flex items-center gap-3 p-3 rounded-xl
                  bg-zinc-800/50 border border-zinc-700/50
                  hover:border-zinc-600/50 transition-colors duration-200
                `}
              >
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                  {metric.icon}
                </div>
                <div className="min-w-0">
                  <span className={`block text-xl font-semibold text-white`}>
                    {metric.value}
                  </span>
                  <span className="block text-xs text-zinc-500 truncate">
                    {metric.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskListNumber;
