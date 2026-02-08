import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Quick Actions Component
 */
const QuickActions = ({ onCreateTask, onManageTeam }) => {
  const actions = [
    {
      label: "New Task",
      icon: Icons.Plus,
      color: "emerald",
      onClick: onCreateTask,
    },
    {
      label: "Manage Team",
      icon: Icons.Users,
      color: "purple",
      onClick: onManageTeam,
    },
  ];

  const colorClasses = {
    emerald:
      "hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30",
    blue: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30",
    purple:
      "hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30",
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Icons.Lightning className="h-4 w-4 text-zinc-400" />
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-700/50 text-zinc-400 transition-all duration-200 cursor-pointer ${colorClasses[action.color]}`}
            aria-label={action.label}
          >
            <action.icon className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
