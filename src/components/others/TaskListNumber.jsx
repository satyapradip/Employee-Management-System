import React, { useMemo } from "react";

/**
 * Task Statistics Cards
 * Displays counts for different task statuses
 */
const TaskListNumber = ({ data }) => {
  // Calculate task statistics from employee data
  const stats = useMemo(() => {
    if (!data?.tasks) {
      return { newTask: 0, active: 0, completed: 0, failed: 0 };
    }

    return data.tasks.reduce(
      (acc, task) => {
        if (task.newTask) acc.newTask++;
        if (task.active) acc.active++;
        if (task.completed) acc.completed++;
        if (task.failed) acc.failed++;
        return acc;
      },
      { newTask: 0, active: 0, completed: 0, failed: 0 },
    );
  }, [data?.tasks]);

  const statCards = [
    {
      label: "New Tasks",
      value: stats.newTask,
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20 hover:shadow-blue-500/40",
      border: "border-blue-400/20",
      icon: (
        <svg
          className="w-8 h-8 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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
      label: "Active",
      value: stats.active,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20 hover:shadow-amber-500/40",
      border: "border-amber-400/20",
      icon: (
        <svg
          className="w-8 h-8 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.completed,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
      border: "border-emerald-400/20",
      icon: (
        <svg
          className="w-8 h-8 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20 hover:shadow-rose-500/40",
      border: "border-rose-400/20",
      icon: (
        <svg
          className="w-8 h-8 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
      {statCards.map((card, index) => (
        <div
          key={card.label}
          className={`
            relative overflow-hidden
            bg-linear-to-br ${card.gradient}
            py-6 px-6 rounded-2xl
            shadow-lg ${card.shadow}
            hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2
            transition-all duration-500 ease-out
            cursor-pointer backdrop-blur-sm
            border ${card.border}
            group
            animate-slideUp
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-black/10 rounded-full blur-xl" />

          {/* Content */}
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight group-hover:scale-110 transition-transform duration-300 origin-left">
                {card.value}
              </h2>
              <h3 className="text-base font-medium opacity-90 mt-1">
                {card.label}
              </h3>
            </div>
            <div className="transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>
      ))}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TaskListNumber;
